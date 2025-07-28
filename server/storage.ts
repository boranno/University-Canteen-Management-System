import {
  users,
  canteens,
  menuItems,
  reviews,
  favorites,
  type User,
  type UpsertUser,
  type Canteen,
  type InsertCanteen,
  type MenuItem,
  type InsertMenuItem,
  type Review,
  type InsertReview,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Canteen operations
  getAllCanteens(): Promise<Canteen[]>;
  getCanteen(id: string): Promise<Canteen | undefined>;
  createCanteen(canteen: InsertCanteen): Promise<Canteen>;
  updateCanteen(id: string, canteen: Partial<InsertCanteen>): Promise<Canteen | undefined>;
  searchCanteens(query: string): Promise<Canteen[]>;
  
  // Menu item operations
  getMenuItemsByCanteen(canteenId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  searchMenuItems(query: string): Promise<MenuItem[]>;
  getPopularMenuItems(limit?: number): Promise<MenuItem[]>;
  
  // Review operations
  getReviewsByCanteen(canteenId: string): Promise<(Review & { user: User })[]>;
  getReviewsByMenuItem(menuItemId: string): Promise<(Review & { user: User })[]>;
  getRecentReviews(limit?: number): Promise<(Review & { user: User; canteen?: Canteen; menuItem?: MenuItem })[]>;
  createReview(review: InsertReview): Promise<Review>;
  getUserReviews(userId: string): Promise<(Review & { canteen?: Canteen; menuItem?: MenuItem })[]>;
  
  // Favorite operations
  getUserFavorites(userId: string): Promise<(Favorite & { canteen?: Canteen; menuItem?: MenuItem })[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, canteenId?: string, menuItemId?: string): Promise<boolean>;
  isFavorite(userId: string, canteenId?: string, menuItemId?: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Canteen operations
  async getAllCanteens(): Promise<Canteen[]> {
    return await db.select().from(canteens).orderBy(desc(canteens.rating));
  }

  async getCanteen(id: string): Promise<Canteen | undefined> {
    const [canteen] = await db.select().from(canteens).where(eq(canteens.id, id));
    return canteen;
  }

  async createCanteen(canteen: InsertCanteen): Promise<Canteen> {
    const [newCanteen] = await db.insert(canteens).values(canteen).returning();
    return newCanteen;
  }

  async updateCanteen(id: string, canteen: Partial<InsertCanteen>): Promise<Canteen | undefined> {
    const [updatedCanteen] = await db
      .update(canteens)
      .set({ ...canteen, updatedAt: new Date() })
      .where(eq(canteens.id, id))
      .returning();
    return updatedCanteen;
  }

  async searchCanteens(query: string): Promise<Canteen[]> {
    return await db
      .select()
      .from(canteens)
      .where(
        or(
          ilike(canteens.name, `%${query}%`),
          ilike(canteens.description, `%${query}%`),
          ilike(canteens.location, `%${query}%`)
        )
      )
      .orderBy(desc(canteens.rating));
  }

  // Menu item operations
  async getMenuItemsByCanteen(canteenId: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.canteenId, canteenId))
      .orderBy(desc(menuItems.rating));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db.insert(menuItems).values(menuItem).returning();
    return newMenuItem;
  }

  async updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set({ ...menuItem, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return updatedMenuItem;
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(
        or(
          ilike(menuItems.name, `%${query}%`),
          ilike(menuItems.description, `%${query}%`),
          ilike(menuItems.category, `%${query}%`)
        )
      )
      .orderBy(desc(menuItems.rating));
  }

  async getPopularMenuItems(limit = 8): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.isAvailable, true))
      .orderBy(desc(menuItems.rating), desc(menuItems.reviewCount))
      .limit(limit);
  }

  // Review operations
  async getReviewsByCanteen(canteenId: string): Promise<(Review & { user: User })[]> {
    const result = await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.canteenId, canteenId))
      .orderBy(desc(reviews.createdAt));

    return result.map(row => ({
      ...row.reviews,
      user: row.users,
    }));
  }

  async getReviewsByMenuItem(menuItemId: string): Promise<(Review & { user: User })[]> {
    const result = await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.menuItemId, menuItemId))
      .orderBy(desc(reviews.createdAt));

    return result.map(row => ({
      ...row.reviews,
      user: row.users,
    }));
  }

  async getRecentReviews(limit = 6): Promise<(Review & { user: User; canteen?: Canteen; menuItem?: MenuItem })[]> {
    const result = await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .leftJoin(canteens, eq(reviews.canteenId, canteens.id))
      .leftJoin(menuItems, eq(reviews.menuItemId, menuItems.id))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    return result.map(row => ({
      ...row.reviews,
      user: row.users,
      canteen: row.canteens || undefined,
      menuItem: row.menu_items || undefined,
    }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update canteen/menu item ratings
    if (review.canteenId) {
      await this.updateCanteenRating(review.canteenId);
    }
    if (review.menuItemId) {
      await this.updateMenuItemRating(review.menuItemId);
    }
    
    return newReview;
  }

  async getUserReviews(userId: string): Promise<(Review & { canteen?: Canteen; menuItem?: MenuItem })[]> {
    const result = await db
      .select()
      .from(reviews)
      .leftJoin(canteens, eq(reviews.canteenId, canteens.id))
      .leftJoin(menuItems, eq(reviews.menuItemId, menuItems.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));

    return result.map(row => ({
      ...row.reviews,
      canteen: row.canteens || undefined,
      menuItem: row.menu_items || undefined,
    }));
  }

  // Favorite operations
  async getUserFavorites(userId: string): Promise<(Favorite & { canteen?: Canteen; menuItem?: MenuItem })[]> {
    const result = await db
      .select()
      .from(favorites)
      .leftJoin(canteens, eq(favorites.canteenId, canteens.id))
      .leftJoin(menuItems, eq(favorites.menuItemId, menuItems.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return result.map(row => ({
      ...row.favorites,
      canteen: row.canteens || undefined,
      menuItem: row.menu_items || undefined,
    }));
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async removeFavorite(userId: string, canteenId?: string, menuItemId?: string): Promise<boolean> {
    let whereClause = eq(favorites.userId, userId);
    
    if (canteenId) {
      whereClause = and(whereClause, eq(favorites.canteenId, canteenId)) as any;
    }
    if (menuItemId) {
      whereClause = and(whereClause, eq(favorites.menuItemId, menuItemId)) as any;
    }

    const result = await db.delete(favorites).where(whereClause);
    return (result.rowCount ?? 0) > 0;
  }

  async isFavorite(userId: string, canteenId?: string, menuItemId?: string): Promise<boolean> {
    let whereClause = eq(favorites.userId, userId);
    
    if (canteenId) {
      whereClause = and(whereClause, eq(favorites.canteenId, canteenId)) as any;
    }
    if (menuItemId) {
      whereClause = and(whereClause, eq(favorites.menuItemId, menuItemId)) as any;
    }

    const [favorite] = await db.select().from(favorites).where(whereClause).limit(1);
    return !!favorite;
  }

  // Helper methods for rating updates
  private async updateCanteenRating(canteenId: string): Promise<void> {
    const result = await db
      .select({
        avgRating: sql<number>`AVG(${reviews.rating})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.canteenId, canteenId));

    if (result[0]) {
      await db
        .update(canteens)
        .set({
          rating: result[0].avgRating,
          reviewCount: result[0].count,
          updatedAt: new Date(),
        })
        .where(eq(canteens.id, canteenId));
    }
  }

  private async updateMenuItemRating(menuItemId: string): Promise<void> {
    const result = await db
      .select({
        avgRating: sql<number>`AVG(${reviews.rating})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.menuItemId, menuItemId));

    if (result[0]) {
      await db
        .update(menuItems)
        .set({
          rating: result[0].avgRating,
          reviewCount: result[0].count,
          updatedAt: new Date(),
        })
        .where(eq(menuItems.id, menuItemId));
    }
  }
}

export const storage = new DatabaseStorage();
