import { Program } from "../Models/ProgramModel.js";

// Create a new community program
export const createProgram = async (req, res) => {
  try {
    const newProgram = new Program({
      title: req.body.title,
      description: req.body.description,
      label: req.body.label,
      address: req.body.address,
      locationRedirectUrl: req.body.locationRedirectUrl,
      mapImage: req.body.mapImage, // Array of image URLs
    });

    const savedProgram = await newProgram.save();
    res.status(201).json({ message: 'Program created successfully', data: savedProgram });
  } catch (error) {
    res.status(400).json({ message: 'Error creating program', error });
  }
};

// Get all community programs
export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.status(200).json({ data: programs });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving programs', error });
  }
};

// Get a single program by ID
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json({ data: program });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving program', error });
  }
};

// Update a community program by ID
export const updateProgram = async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        label: req.body.label,
        address: req.body.address,
        locationRedirectUrl: req.body.locationRedirectUrl,
        mapImage: req.body.mapImage,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ message: 'Program updated successfully', data: updatedProgram });
  } catch (error) {
    res.status(400).json({ message: 'Error updating program', error });
  }
};

// Delete a community program by ID
export const deleteProgram = async (req, res) => {
  try {
    const deletedProgram = await Program.findByIdAndDelete(req.params.id);
    if (!deletedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting program', error });
  }
};

export const getEnrolledPrograms = async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Fetch programs where the user is enrolled
    const enrolledPrograms = await CommunityProgram.find({
      'user_enrollments.email': userEmail,
      'user_enrollments.status': 'Enrolled',
    });

    res.status(200).json(enrolledPrograms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled programs', error });
  }
};

// Get not enrolled programs for a user
export const getNotEnrolledPrograms = async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Fetch programs where the user is not enrolled
    const notEnrolledPrograms = await CommunityProgram.find({
      'user_enrollments.email': { $ne: userEmail },
    });

    res.status(200).json(notEnrolledPrograms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching not enrolled programs', error });
  }
};

// Enroll user in a program
export const enrollInProgram = async (req, res) => {
  const { program_id, user_email } = req.body;

  try {
    // Find the program by its ID
    const program = await CommunityProgram.findById(program_id);

    // Check if the user is already enrolled
    const existingEnrollment = program.user_enrollments.find(enrollment => enrollment.email === user_email);

    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this program.' });
    }

    // Add the enrollment
    program.user_enrollments.push({ email: user_email, status: 'Enrolled' });
    await program.save();

    res.status(200).json({ message: 'Enrollment successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling user.', error });
  }
};
