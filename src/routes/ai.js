import express from "express";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("AI REQUEST RECEIVED:", prompt);

    const text = prompt.toLowerCase();

    let result = {
      audience: 250,
      channel: "Email",
      score: 85,
      message:
        "Hi {name}, check out our latest offers and exclusive deals."
    };

    // Inactive customers
    if (
      text.includes("inactive") ||
      text.includes("not made a purchase") ||
      text.includes("60 days") ||
      text.includes("90 days")
    ) {
      result = {
        audience: 245,
        channel: "WhatsApp",
        score: 92,
        message:
          "Hi {name}, we miss you! Come back and enjoy 20% OFF on your next purchase. Use code COMEBACK20."
      };
    }

    // Laptop customers
    else if (
      text.includes("laptop") ||
      text.includes("electronics")
    ) {
      result = {
        audience: 180,
        channel: "Email",
        score: 95,
        message:
          "Hi {name}, thank you for purchasing a laptop. Get exciting accessories at special discounted prices."
      };
    }

    // VIP customers
    else if (
      text.includes("vip") ||
      text.includes("premium")
    ) {
      result = {
        audience: 75,
        channel: "WhatsApp",
        score: 98,
        message:
          "Dear {name}, as one of our valued VIP customers, enjoy exclusive early access to our premium offers."
      };
    }

    // New customers
    else if (
      text.includes("new customer") ||
      text.includes("new users") ||
      text.includes("first purchase")
    ) {
      result = {
        audience: 320,
        channel: "Email",
        score: 89,
        message:
          "Welcome {name}! Enjoy 15% OFF on your first purchase. We're excited to have you with us."
      };
    }

    // High spenders
    else if (
      text.includes("high value") ||
      text.includes("high spender") ||
      text.includes("top customer")
    ) {
      result = {
        audience: 90,
        channel: "WhatsApp",
        score: 96,
        message:
          "Hi {name}, thank you for being one of our top customers. Enjoy a special reward crafted just for you."
      };
    }

    res.json(result);
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error: "AI generation failed",
      details: error.message
    });
  }
});

export default router;