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
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      organizer: req.body.organizer,
      status: 'active', // Automatically set the status to active
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
        startDate: req.body.startDate,
        endDate: req.body.endDate,
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

// Controller to get all unenrolled programs for a specific user
export const getUnenrolledPrograms = async (req, res) => {
  const { userEmail } = req.query; // Get the user's email from the query parameters

  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // Fetch all programs with status 'active'
    const allPrograms = await Program.find({ status: 'active' }).exec();
    
    // Filter programs where the user is not enrolled
    const unenrolledPrograms = allPrograms.filter(program => {
      const isEnrolled = Array.isArray(program.user_enrollments) &&
                         program.user_enrollments.some(enrollment => 
                            enrollment.email === userEmail && enrollment.status === 'Enrolled'
                         );
      return !isEnrolled; // Include programs that the user is not enrolled in
    });

    res.status(200).json({ data: unenrolledPrograms });
  } catch (error) {
    console.error('Error retrieving programs:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error retrieving programs', error });
  }
};

// Controller function to enroll a user in a program
export const enrollUserInProgram = async (req, res) => {
  const { programId, userEmail } = req.body;

  try {
    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Check if the user is already enrolled
    const existingEnrollment = program.user_enrollments.find(enrollment => enrollment.email === userEmail);

    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this program' });
    }

    // Add the user's email to the user_enrollments array
    program.user_enrollments.push({ email: userEmail, status: 'Enrolled' });
    
    await program.save();

    return res.status(200).json({ message: 'Successfully enrolled in the program', program });
  } catch (error) {
    return res.status(500).json({ message: 'Error enrolling in the program', error });
  }
};

// Controller function to get programs a user is enrolled in
export const getEnrolledPrograms = async (req, res) => {
  const { userEmail, status = 'active' } = req.query; // Get the user's email and status from the query parameters

  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // Fetch all programs with the specified status
    const allPrograms = await Program.find({ status });
    
    // Filter programs that the user is enrolled in
    const enrolledPrograms = allPrograms.filter(program => 
      program.user_enrollments.some(enrollment => enrollment.email === userEmail && enrollment.status === 'Enrolled')
    );

    res.status(200).json({ data: enrolledPrograms });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving enrolled programs', error });
  }
};

