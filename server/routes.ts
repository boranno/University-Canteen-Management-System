import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCanteenSchema, insertMenuItemSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Canteen routes
  app.get('/api/canteens', async (req, res) => {
    try {
      const { search } = req.query;
      let canteens;
      
      if (search && typeof search === 'string') {
        canteens = await storage.searchCanteens(search);
      } else {
        canteens = await storage.getAllCanteens();
      }
      
      res.json(canteens);
    } catch (error) {
      console.error("Error fetching canteens:", error);
      res.status(500).json({ message: "Failed to fetch canteens" });
    }
  });

  app.get('/api/canteens/:id', async (req, res) => {
    try {
      const canteen = await storage.getCanteen(req.params.id);
      if (!canteen) {
        return res.status(404).json({ message: "Canteen not found" });
      }
      res.json(canteen);
    } catch (error) {
      console.error("Error fetching canteen:", error);
      res.status(500).json({ message: "Failed to fetch canteen" });
    }
  });

  app.post('/api/canteens', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCanteenSchema.parse(req.body);
      const canteen = await storage.createCanteen(validatedData);
      res.status(201).json(canteen);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating canteen:", error);
      res.status(500).json({ message: "Failed to create canteen" });
    }
  });

  // Menu item routes
  app.get('/api/menu-items', async (req, res) => {
    try {
      const { search, canteenId, popular } = req.query;
      let menuItems;
      
      if (popular === 'true') {
        menuItems = await storage.getPopularMenuItems();
      } else if (search && typeof search === 'string') {
        menuItems = await storage.searchMenuItems(search);
      } else if (canteenId && typeof canteenId === 'string') {
        menuItems = await storage.getMenuItemsByCanteen(canteenId);
      } else {
        menuItems = await storage.getPopularMenuItems();
      }
      
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get('/api/menu-items/:id', async (req, res) => {
    try {
      const menuItem = await storage.getMenuItem(req.params.id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  app.post('/api/menu-items', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(validatedData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  // Review routes
  app.get('/api/reviews', async (req, res) => {
    try {
      const { canteenId, menuItemId, recent } = req.query;
      let reviews;
      
      if (recent === 'true') {
        reviews = await storage.getRecentReviews();
      } else if (canteenId && typeof canteenId === 'string') {
        reviews = await storage.getReviewsByCanteen(canteenId);
      } else if (menuItemId && typeof menuItemId === 'string') {
        reviews = await storage.getReviewsByMenuItem(menuItemId);
      } else {
        reviews = await storage.getRecentReviews();
      }
      
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviews = await storage.getUserReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Favorite routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { canteenId, menuItemId } = req.body;
      
      if (!canteenId && !menuItemId) {
        return res.status(400).json({ message: "Either canteenId or menuItemId is required" });
      }
      
      const favorite = await storage.addFavorite({ userId, canteenId, menuItemId });
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { canteenId, menuItemId } = req.query;
      
      const success = await storage.removeFavorite(userId, canteenId as string, menuItemId as string);
      if (success) {
        res.json({ message: "Favorite removed" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get('/api/favorites/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { canteenId, menuItemId } = req.query;
      
      const isFavorite = await storage.isFavorite(userId, canteenId as string, menuItemId as string);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: "Failed to check favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
