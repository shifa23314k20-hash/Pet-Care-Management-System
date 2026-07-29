import { generateAIResponse } from "../services/groq.services.js";
import Pet from "../model/pet.model.js";
import Vaccination from "../model/vaccination.model.js";
import Activity from "../model/activity.model.js";
import HealthRecord from "../model/healthRecord.model.js";
import Appointment from "../model/appointment.model.js";
import { generateHealthPDF } from "../services/pdf.services.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const reply = await generateAIResponse(message);

        res.status(200).json({
            success: true,
            reply
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const symptomChecker = async (req, res) => {
    try {

        const { petId, symptoms } = req.body;

        if (!petId || !symptoms) {
            return res.status(400).json({
                success: false,
                message: "Pet ID and symptoms are required"
            });
        }

        const pet = await Pet.findOne({ id: petId });

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found"
            });
        }

        const prompt = `
You are an experienced veterinarian.

Pet Details:
Name: ${pet.name}
Type: ${pet.type}
Breed: ${pet.breed}
Age: ${pet.age}
Weight: ${pet.weight} kg

Symptoms:
${symptoms.join(", ")}

Provide:
1. Possible illness
2. Severity (Low/Medium/High)
3. Home care advice
4. Whether a vet visit is recommended

Mention clearly that this is not a confirmed diagnosis.
`;

        const response = await generateAIResponse(prompt);

        res.status(200).json({
            success: true,
            diagnosis: response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const careRecommendation = async (req, res) => {

    try {

        const { petId } = req.body;

        const pet = await Pet.findOne({ id: petId });

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found"
            });
        }

        const prompt = `
Generate a daily care plan for this pet.

Pet Details:

Name: ${pet.name}
Type: ${pet.type}
Breed: ${pet.breed}
Age: ${pet.age}
Weight: ${pet.weight}

Include:

• Diet

• Water Intake

• Grooming

• General Health Tips
`;

        const reply = await generateAIResponse(prompt);

        res.status(200).json({
            success: true,
            recommendation: reply
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const vaccinationAssistant = async (req, res) => {

    try {

        const { petId } = req.body;

        const pet = await Pet.findOne({ id: petId });

        const vaccines = await Vaccination.find({ petId });

        const prompt = `
Pet Details

Name: ${pet.name}

Type: ${pet.type}

Breed: ${pet.breed}

Age: ${pet.age}

Vaccination History

${JSON.stringify(vaccines)}

Suggest

1. Next vaccine

2. Missed vaccines

3. Recommended schedule

4. Importance of each vaccine.
`;

        const reply = await generateAIResponse(prompt);

        res.status(200).json({
            success: true,
            advice: reply
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const generateHealthReport = async (req, res) => {
    try {
        const { petId } = req.body;

        if (!petId) {
            return res.status(400).json({
                success: false,
                message: "Pet ID is required",
            });
        }

        // Fetch pet
        const pet = await Pet.findOne({ id: petId });

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found",
            });
        }

        // Fetch related data
        const healthRecords = await HealthRecord.find({ petId });

        const activities = await Activity.find({ petId });

        const vaccinations = await Vaccination.find({ petId });

        const appointments = await Appointment.find({ petId });

        // AI Prompt
        const prompt = `
You are an experienced veterinarian.

Analyze the following pet information.

Pet Information:
${JSON.stringify(pet, null, 2)}

Health Records:
${JSON.stringify(healthRecords, null, 2)}

Activities:
${JSON.stringify(activities, null, 2)}

Vaccinations:
${JSON.stringify(vaccinations, null, 2)}

Appointments:
${JSON.stringify(appointments, null, 2)}

Return ONLY valid JSON.

Do not use markdown.
Do not use **.
Do not use #.
Do not write any explanation outside JSON.

Return exactly:

{
  "overallHealthSummary": "",
  "currentHealthCondition": "",
  "potentialHealthRisks": "",
  "recommendations": "",
  "preventiveCareTips": "",
  "disclaimer": ""
}
`;

        const aiResponse = await generateAIResponse(prompt);

        const aiSummary = JSON.parse(aiResponse);

        generateHealthPDF(
            {
                pet,
                healthRecords,
                activities,
                vaccinations,
                appointments,
                aiSummary,
            },
            res
        );

    } catch (error) {
        console.error("Generate Health Report Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};