import { Donation } from "../Models/DonationModel.js";

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    const {
      title,
      description,
      amountRaised,
      amountRequired,
      location,
      category,
      bankDetails,
      directCash,
      organization,
      emergency,
    } = req.body;
    console.log(req);

    // Generate a new donation ID in the format "D0001"
    const latestDonation = await Donation.find().sort({ createdAt: -1 }).limit(1);
    let Id;

    if (latestDonation.length !== 0) {
      const latestId = parseInt(latestDonation[0].Id.slice(1)); // Get the latest ID
      Id = "D" + String(latestId + 1).padStart(4, "0"); // Increment and format
    } else {
      Id = "D0001"; // Starting ID
    }

    // Create the new donation object
    const newDonation = new Donation({
      Id, // Set the generated donation ID // Set the user ID
      title,
      description,
      amountRaised: amountRaised || 0, // Default to 0 if not provided
      amountRequired,
      location,
      category,
      bankDetails,
      directCash,
      organization,
      emergency
    });

    // Save the new donation to the database
    const savedDonation = await newDonation.save();
      
    // Return the created donation
    res.status(201).json({
      
      message: "Donation created successfully",
      donation: {
        _id: savedDonation._id,
        Id: savedDonation.Id, // Include the custom ID in the response
        title: savedDonation.title,
        description: savedDonation.description,
        amountRaised: savedDonation.amountRaised,
        amountRequired: savedDonation.amountRequired,
        location: savedDonation.location,
        category: savedDonation.category,
        bankDetails: savedDonation.bankDetails,
        directCash: savedDonation.directCash,
        organization: savedDonation.organization,
        emergency:savedDonation.emergency
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("not created")
  }
};

// Update an existing donation by ID
export const updateDonation = async (req, res) => {
  const { id } = req.params;
   
  try {
    const {
      title,
      description,
      amountRaised,
      amountRequired,
      location,
      category,
      bankDetails,
      directCash,
      organization,
      emergency
    } = req.body;

    // Find the donation by ID
    const donation = await Donation.findOne({Id:id});
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Update the donation fields
    const updatedDonation = await Donation.findOneAndUpdate(
      {Id:id},
      {
        title: title || donation.title,
        description: description || donation.description,
        amountRaised: amountRaised !== undefined ? amountRaised : donation.amountRaised,
        amountRequired: amountRequired || donation.amountRequired,
        location: location || donation.location,
        category: category || donation.category,
        bankDetails: bankDetails || donation.bankDetails,
        directCash: directCash !== undefined ? directCash : donation.directCash,
        organization: organization || donation.organization,
        emergency: emergency || donation.emergency,

      },
      { new: true, runValidators: true }
    );

    // Return the updated donation
    res.status(200).json({
      message: "Donation updated successfully",
      donation: {
        _id: updatedDonation._id,
        Id: updatedDonation.Id, // Include the custom ID in the response
        title: updatedDonation.title,
        description: updatedDonation.description,
        amountRaised: updatedDonation.amountRaised,
        amountRequired: updatedDonation.amountRequired,
        location: updatedDonation.location,
        category: updatedDonation.category,
        bankDetails: updatedDonation.bankDetails,
        directCash: updatedDonation.directCash,
        organization: updatedDonation.organization,
        emergency: updatedDonation.emergency,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a donation by ID
export const deleteDonation = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const donation = await Donation.findOneAndDelete({Id:id});
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "falied here bro" });
  }
};

// Retrieve all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json({
      message: "Donations retrieved successfully",
      donations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a single donation by ID
export const getDonationById = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await Donation.findOne({Id:id});
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json({
      message: "Donation retrieved successfully",
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
