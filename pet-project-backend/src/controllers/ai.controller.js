import { generateAIResponse } from "../services/groq.services.js";

import Pet from "../model/pet.model.js";
import Vaccination from "../model/vaccination.model.js";
import Activity from "../model/activity.model.js";
import HealthRecord from "../model/healthRecord.model.js";
import Appointment from "../model/appointment.model.js";

import { generateHealthPDF } from "../services/pdf.services.js";


// =========================
// CHAT WITH AI
// =========================
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await generateAIResponse(message.trim());

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};


// =========================
// SYMPTOM CHECKER
// =========================
export const symptomChecker = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { petId, symptoms } = req.body;

    if (!petId || !symptoms) {
      return res.status(400).json({
        success: false,
        message: "Pet ID and symptoms are required",
      });
    }

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Symptoms must be a non-empty array",
      });
    }

    // Verify pet ownership
    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    const prompt = `
You are a pet health assistant.

You are NOT a substitute for a licensed veterinarian.

Pet Details:
Name: ${pet.name}
Type: ${pet.type}
Breed: ${pet.breed}
Age: ${pet.age}
Weight: ${pet.weight} kg

Reported Symptoms:
${symptoms.join(", ")}

Provide:

1. Possible causes or conditions
2. Severity: Low, Medium, or High
3. General supportive care
4. Whether veterinary attention is recommended
5. Warning signs that require urgent veterinary attention

Do not claim to provide a confirmed diagnosis.
Clearly state that the information is for educational purposes only.
`;

    const response = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      diagnosis: response,
    });
  } catch (error) {
    console.error("SYMPTOM CHECKER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze symptoms",
    });
  }
};


// =========================
// CARE RECOMMENDATION
// =========================
export const careRecommendation = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({
        success: false,
        message: "Pet ID is required",
      });
    }

    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    const prompt = `
Create a general daily care plan for this pet.

Pet Details:
Name: ${pet.name}
Type: ${pet.type}
Breed: ${pet.breed}
Age: ${pet.age}
Weight: ${pet.weight} kg

Include:

1. Diet
2. Water and hydration
3. Exercise
4. Grooming
5. General health tips

Keep the recommendations general and safe.
Mention that specific dietary or medical recommendations should be confirmed with a veterinarian.
`;

    const reply = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      recommendation: reply,
    });
  } catch (error) {
    console.error("CARE RECOMMENDATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate care recommendation",
    });
  }
};


// =========================
// VACCINATION ASSISTANT
// =========================
export const vaccinationAssistant = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({
        success: false,
        message: "Pet ID is required",
      });
    }

    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    const vaccines = await Vaccination.find({
      petId,
      userId,
    }).sort({
      dateGiven: -1,
    });

    const prompt = `
You are a pet vaccination assistant.

Pet Details:
Name: ${pet.name}
Type: ${pet.type}
Breed: ${pet.breed}
Age: ${pet.age}
Weight: ${pet.weight} kg

Vaccination History:
${JSON.stringify(vaccines, null, 2)}

Provide:

1. Vaccinations that may be due
2. Potentially missed vaccinations
3. General vaccination schedule guidance
4. Importance of recommended vaccines

Do not claim that a specific vaccine is definitely required.
Vaccination schedules vary depending on the pet's age, location, health, and veterinarian recommendations.

Recommend consulting a veterinarian for the final vaccination schedule.
`;

    const reply = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      advice: reply,
    });
  } catch (error) {
    console.error("VACCINATION ASSISTANT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate vaccination advice",
    });
  }
};


// =========================
// GENERATE HEALTH REPORT
// =========================
export const generateHealthReport = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({
        success: false,
        message: "Pet ID is required",
      });
    }

    // =========================
    // VERIFY PET OWNERSHIP
    // =========================
    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    // =========================
    // FETCH USER'S PET DATA
    // =========================
    const healthRecords = await HealthRecord.find({
      petId,
      userId,
    }).sort({
      visitDate: -1,
    });

    const activities = await Activity.find({
      petId,
      userId,
    }).sort({
      date: -1,
    });

    const vaccinations = await Vaccination.find({
      petId,
      userId,
    }).sort({
      dateGiven: -1,
    });

    const appointments = await Appointment.find({
      petId,
      userId,
    }).sort({
      dateTime: -1,
    });

    // =========================
    // AI PROMPT
    // =========================
    const prompt = `
You are a pet health assistant.

Analyze the following pet information and provide a general health summary.

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
  "disclaimer": "This report is for informational purposes only and is not a veterinary diagnosis."
}
`;

    const aiResponse = await generateAIResponse(prompt);

    let aiSummary;

    try {
      aiSummary = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("AI JSON PARSE ERROR:", parseError);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid health report format",
      });
    }

    // =========================
    // GENERATE PDF
    // =========================
    return generateHealthPDF(
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
    console.error("GENERATE HEALTH REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate health report",
    });
  }
};