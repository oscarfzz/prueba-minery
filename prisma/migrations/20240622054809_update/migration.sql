/*
  Warnings:

  - You are about to drop the column `productId` on the `Warehouse` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ProductToWarehouse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProductToWarehouse_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToWarehouse_B_fkey" FOREIGN KEY ("B") REFERENCES "Warehouse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Warehouse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "long" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Warehouse" ("createdAt", "id", "lat", "long", "name", "updatedAt") SELECT "createdAt", "id", "lat", "long", "name", "updatedAt" FROM "Warehouse";
DROP TABLE "Warehouse";
ALTER TABLE "new_Warehouse" RENAME TO "Warehouse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToWarehouse_AB_unique" ON "_ProductToWarehouse"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToWarehouse_B_index" ON "_ProductToWarehouse"("B");
