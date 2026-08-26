// backend/src/controllers/donationController.js - UPDATED
import Donation from '../models/Donation.js';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';
import { io } from '../server.js';
import { exportDonationsToExcel } from '../utils/excelExport.js';

// Helper function to generate receipt number
const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Donation.countDocuments();
  return `R-${year}-${String(count + 1).padStart(4, '0')}`;
};

// Get donations with search, filters, sorting, pagination
export const getDonations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      paymentMethod,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      paymentStatus,
      sortBy = 'donationDate',
      sortOrder = 'desc',
    } = req.query;

    const skip = (page - 1) * limit;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { donorPhone: { $regex: search, $options: 'i' } },
        { donorEmail: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
      ];
      if (!isNaN(search) && search.trim() !== '') {
        query.$or.push({ amount: Number(search) });
      }
    }

    // Filters
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (category) query.category = category;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (startDate && endDate) {
      query.donationDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (minAmount !== '' || maxAmount !== '') {
      const amountFilter = {};
      if (minAmount !== '' && !isNaN(minAmount)) amountFilter.$gte = Number(minAmount);
      if (maxAmount !== '' && !isNaN(maxAmount)) amountFilter.$lte = Number(maxAmount);
      if (Object.keys(amountFilter).length > 0) query.amount = amountFilter;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [donations, total] = await Promise.all([
      Donation.find(query)
        .populate('donorId', 'name photo phone email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Donation.countDocuments(query),
    ]);

    // Calculate summary statistics with payment status breakdown
    const summary = await Donation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          count: { $sum: 1 },
          qrPayments: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'qr'] }, 1, 0] } },
          cashPayments: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'cash'] }, 1, 0] } },
          qrTotal: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'qr'] }, '$amount', 0] } },
          cashTotal: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'cash'] }, '$amount', 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
          paidCount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
          pendingAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$amount', 0] } },
          paidAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$amount', 0] } },
        },
      },
    ]);

    // Get unique donors count
    const uniqueDonors = await Donation.aggregate([
      { $match: query },
      { $group: { _id: '$donorName' } },
      { $count: 'count' },
    ]);

    // Get monthly aggregation
    const monthly = await Donation.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      data: donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      summary: summary[0] || {
        totalAmount: 0,
        averageAmount: 0,
        count: 0,
        qrPayments: 0,
        cashPayments: 0,
        qrTotal: 0,
        cashTotal: 0,
        pendingCount: 0,
        paidCount: 0,
        pendingAmount: 0,
        paidAmount: 0,
      },
      uniqueDonors: uniqueDonors[0]?.count || 0,
      monthly,
    });
  } catch (error) {
    console.error("❌ GET DONATIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get donation by ID
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name photo phone email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    console.error("❌ GET DONATION BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create donation
export const createDonation = async (req, res) => {
  try {
    console.log("📥 Create Donation Request Body:", req.body);

    const donationData = {
      ...req.body,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    };

    // Clean up empty fields
    if (!donationData.donorEmail || donationData.donorEmail.trim() === '') {
      delete donationData.donorEmail;
    }
    if (!donationData.donorPhone || donationData.donorPhone.trim() === '') {
      delete donationData.donorPhone;
    }
    if (!donationData.remarks || donationData.remarks.trim() === '') {
      delete donationData.remarks;
    }

    // If donor is a member/family, populate donorName from member
    if ((donationData.donorType === 'member' || donationData.donorType === 'family') && donationData.donorId) {
      const member = await Member.findById(donationData.donorId);
      if (member) {
        donationData.donorName = member.name;
        donationData.donorPhone = member.phone || donationData.donorPhone || '';
        donationData.donorEmail = member.email || donationData.donorEmail || '';
      } else {
        return res.status(400).json({ message: 'Selected member not found' });
      }
    }

    // Ensure donorName is present
    if (!donationData.donorName) {
      return res.status(400).json({ message: 'Donor name is required' });
    }

    // Generate receipt number
    donationData.receiptNumber = await generateReceiptNumber();

    // Set default paymentStatus if not provided
    if (!donationData.paymentStatus) {
      donationData.paymentStatus = 'pending';
    }

    const donation = new Donation(donationData);
    await donation.save();

    // Auto-create notification
    const notificationMessage = `${donation.donorName} donated Rs. ${donation.amount.toFixed(2)} via ${donation.paymentMethod.toUpperCase()} - Status: ${donation.paymentStatus}`;
    
    const notification = new Notification({
      type: 'donation_added',
      title: 'New Donation Received',
      message: notificationMessage,
      data: {
        donationId: donation._id,
        donorName: donation.donorName,
        amount: donation.amount,
        paymentMethod: donation.paymentMethod,
        receiptNumber: donation.receiptNumber,
        paymentStatus: donation.paymentStatus,
      },
      createdBy: req.user?._id || null,
    });

    await notification.save();

    if (io) {
      io.emit('donation:created', donation);
      io.emit('notification:new', notification);
    }

    res.status(201).json(donation);
  } catch (error) {
    console.error("❌ Create Donation Error:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update donation
export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user?._id || null,
    };

    // Clean up empty fields
    if (!updateData.donorEmail || updateData.donorEmail.trim() === '') {
      delete updateData.donorEmail;
    }
    if (!updateData.donorPhone || updateData.donorPhone.trim() === '') {
      delete updateData.donorPhone;
    }
    if (!updateData.remarks || updateData.remarks.trim() === '') {
      delete updateData.remarks;
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('donorId', 'name photo phone email');

    if (io) {
      io.emit('donation:updated', updatedDonation);
    }

    res.json(updatedDonation);
  } catch (error) {
    console.error("❌ Update Donation Error:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete donation
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    await donation.deleteOne();

    if (io) {
      io.emit('donation:deleted', { id: req.params.id });
    }

    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error("❌ Delete Donation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get donation statistics
export const getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          count: { $sum: 1 },
          qrPayments: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'qr'] }, 1, 0] } },
          cashPayments: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'cash'] }, 1, 0] } },
          pendingPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
          paidPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
          pendingAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$amount', 0] } },
          paidAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$amount', 0] } },
        },
      },
    ]);

    // Unique donors
    const uniqueDonors = await Donation.aggregate([
      { $group: { _id: '$donorName' } },
      { $count: 'count' },
    ]);

    const monthlyStats = await Donation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Per donor total
    const perDonorStats = await Donation.aggregate([
      {
        $group: {
          _id: '$donorName',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 20 },
    ]);

    const paymentMethodStats = await Donation.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$amount' },
        },
      },
    ]);

    res.json({
      overall: stats[0] || {
        totalAmount: 0,
        averageAmount: 0,
        count: 0,
        qrPayments: 0,
        cashPayments: 0,
        pendingPayments: 0,
        paidPayments: 0,
        pendingAmount: 0,
        paidAmount: 0,
      },
      uniqueDonors: uniqueDonors[0]?.count || 0,
      monthly: monthlyStats,
      byPaymentMethod: paymentMethodStats,
      perDonor: perDonorStats,
    });
  } catch (error) {
    console.error("❌ Get Donation Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Export all donations to Excel
export const exportAllDonationsToExcel = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donorId', 'name phone email')
      .sort({ donationDate: -1 });

    const buffer = await exportDonationsToExcel(donations);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=donations_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error("❌ Export All Donations Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Export single donation to Excel
export const exportDonationToExcel = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name phone email');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const buffer = await exportDonationsToExcel([donation]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=donation_${donation.receiptNumber}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error("❌ Export Single Donation Error:", error);
    res.status(500).json({ message: error.message });
  }
};