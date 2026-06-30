import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- DATABASE PERSISTENCE SETUP ---
const DB_FILE = path.join(process.cwd(), 'orders-db.json');

interface DBOrder {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  user_id: string; // User email / login unique identifier
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}

// Ensure the database file exists and is seeded with initial orders if empty
function readOrdersDB(): DBOrder[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialOrders: DBOrder[] = [
        {
          id: 'ORD-8941',
          product_name: 'The Eternal Solitaire Ring',
          price: 18500,
          quantity: 1,
          user_id: 'aarav.m@gmail.com',
          status: 'Shipped',
          date: '2026-06-23'
        },
        {
          id: 'ORD-7624-1',
          product_name: 'The Royal Peacock Jhumkas',
          price: 3600,
          quantity: 1,
          user_id: 'meera.deshmukh@yahoo.com',
          status: 'Delivered',
          date: '2026-06-18'
        },
        {
          id: 'ORD-7624-2',
          product_name: 'Trinity Gold Huggies',
          price: 1250,
          quantity: 1,
          user_id: 'meera.deshmukh@yahoo.com',
          status: 'Delivered',
          date: '2026-06-18'
        },
        {
          id: 'ORD-4122',
          product_name: 'Saptapadi Wedding Band Set',
          price: 2400,
          quantity: 1,
          user_id: 'devika.sen@outlook.com',
          status: 'Pending',
          date: '2026-06-25'
        }
      ];
      fs.writeFileSync(DB_FILE, JSON.stringify(initialOrders, null, 2), 'utf-8');
      return initialOrders;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders DB file, falling back to empty', err);
    return [];
  }
}

function writeOrdersDB(orders: DBOrder[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders DB file', err);
  }
}

// Initialize on startup
readOrdersDB();

// Helper to extract bearer token / email representing user identity
function getAuthenticatedUserEmail(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token || null;
}

// GET /my-orders & GET /api/my-orders
const getMyOrdersHandler = (req: express.Request, res: express.Response) => {
  const userEmail = getAuthenticatedUserEmail(req);
  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const allOrders = readOrdersDB();
  const userOrders = allOrders.filter(
    (o) => o.user_id && o.user_id.toLowerCase() === userEmail.toLowerCase()
  );
  res.json(userOrders);
};

app.get('/my-orders', getMyOrdersHandler);
app.get('/api/my-orders', getMyOrdersHandler);

// POST /orders & POST /api/orders
const createOrderHandler = (req: express.Request, res: express.Response) => {
  const userEmail = getAuthenticatedUserEmail(req);
  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, product_name, price, quantity, status, date } = req.body;
  if (!id || !product_name || !price || !quantity) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const allOrders = readOrdersDB();
  const newOrder: DBOrder = {
    id,
    product_name,
    price: Number(price),
    quantity: Number(quantity),
    user_id: userEmail,
    status: status || 'Pending',
    date: date || new Date().toISOString().split('T')[0]
  };

  allOrders.unshift(newOrder);
  writeOrdersDB(allOrders);

  res.status(201).json(newOrder);
};

app.post('/orders', createOrderHandler);
app.post('/api/orders', createOrderHandler);

// GET /api/admin/orders - Fetch all orders for admin portal
app.get('/api/admin/orders', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'ATELIER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(readOrdersDB());
});

// PUT /api/admin/orders/:id/status - Update order status from admin portal
app.put('/api/admin/orders/:id/status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'ATELIER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const allOrders = readOrdersDB();
  let updated = false;
  const updatedOrders = allOrders.map((o) => {
    if (o.id === id) {
      updated = true;
      return { ...o, status };
    }
    return o;
  });

  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  writeOrdersDB(updatedOrders);
  res.json({ message: 'Order status updated successfully' });
});

// Initialize GoogleGenAI SDK safely
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API route: AI Jewellery Consultant
app.post('/api/gemini/consultant', async (req, res) => {
  try {
    const { budget, occasion, jewelType, style, catalogProducts } = req.body;

    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not configured
      const budgetNum = Number(budget) || 10000;
      const matched = (catalogProducts || []).filter((p: any) => p.price <= budgetNum);
      const recommended = matched.slice(0, 2);

      return res.json({
        recommendedProductIds: recommended.map((p: any) => p.id),
        consultantAdvice: `Welcome to ATELIER, where heritage meets your personal aspirations. As your bespoke concierge advisor, I have curated a selection for your upcoming ${occasion || 'celebration'}. Under your luxury budget of $${budgetNum.toLocaleString()}, these creations represent the pinnacle of fine design. Styled to complement a ${style || 'refined elegant'} look, they stand ready to accompany you through moments of celebration. To activate live premium AI insights, please configure your GEMINI_API_KEY in the Secrets panel.`
      });
    }

    const prompt = `You are the ATELIER AI Jewellery Consultant, a concierge at an ultra-luxury jewellery house in India.
Your customer has requested personalized recommendations with these details:
- Budget: $${budget}
- Occasion: ${occasion}
- Jewellery Type: ${jewelType}
- Style Preference: ${style}

Here is our current masterpiece catalog of fine jewellery (including id, name, price, description, collection, materials):
${JSON.stringify(catalogProducts)}

Generate a personalized response advising the customer. It MUST match their requirements:
1. Recommend 1 or 2 specific masterpieces from the catalog that fit best, explaining why they fit the occasion and style.
2. Formulate the response with extreme elegance, poise, and sophistication.
3. Return the response in a JSON format matching the schema:
{
  "recommendedProductIds": ["id1", "id2"],
  "consultantAdvice": "Sophisticated narrative explaining the recommendations and styling tips..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            recommendedProductIds: {
              type: 'ARRAY',
              items: { type: 'STRING' }
            },
            consultantAdvice: { type: 'STRING' }
          },
          required: ['recommendedProductIds', 'consultantAdvice']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from model");
    }

    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: error.message || 'Error processing consultant request' });
  }
});

// Configure Vite or Static Assets
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Atelier Full-Stack Server listening on http://localhost:${PORT} [NODE_ENV=${process.env.NODE_ENV || 'development'}]`);
  });
}

setupVite();
