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

// Controller to get all unenrolled programs for a specific user
export const getUnenrolledPrograms = async (req, res) => {
  const { userEmail } = req.query; // Get the user's email from the query parameters
  console.log(userEmail);
  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // Fetch all programs from the database
    const allPrograms = await Program.find();
    console.log(allPrograms);

    // Filter programs that the user is not enrolled in
    const unenrolledPrograms = allPrograms.filter(program => {
      // Check if user_enrollments is an array and contains the userEmail
      const isEnrolled = Array.isArray(program.user_enrollments) && 
                         program.user_enrollments.some(enrollment => enrollment.email === userEmail && enrollment.status === 'Enrolled');
      return !isEnrolled; // Include programs that the user is not enrolled in
    });

    res.status(200).json({ data: unenrolledPrograms });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving programs', error });
  }
};





// Controller function to enroll a user in a program
export const enrollUserInProgram = async (req, res) => {
  const { programId, userEmail } = req.body;
  console.log(userEmail, programId);

  try {
    // Find the program by ID in the database
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
    
    // Save the updated program
    await program.save();

    return res.status(200).json({ message: 'Successfully enrolled in the program', program });
  } catch (error) {
    return res.status(500).json({ message: 'Error enrolling in the program', error });
  }
};

// Controller function to get programs a user is enrolled in
export const getEnrolledPrograms = async (req, res) => {
  const { userEmail } = req.query; // Get the user's email from the query parameters
  console.log(userEmail);
  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    // Fetch all programs from the database
    const allPrograms = await Program.find();
    
    // Filter programs that the user is enrolled in
    const enrolledPrograms = allPrograms.filter(program => 
      program.user_enrollments.some(enrollment => enrollment.email === userEmail && enrollment.status === 'Enrolled')
    );

    res.status(200).json({ data: enrolledPrograms });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving enrolled programs', error });
  }
};
