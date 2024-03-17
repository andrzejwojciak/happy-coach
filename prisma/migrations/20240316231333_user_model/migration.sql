-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT,
    "firstLoginDate" TEXT,
    "lastLoginDate" TEXT,
    "isAdmin" BOOLEAN,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

INSERT INTO "User" (id)
SELECT DISTINCT "userId" FROM "record"; 

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
