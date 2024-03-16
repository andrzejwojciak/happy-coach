-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "channelId" VARCHAR NOT NULL,
    "theme" VARCHAR,
    "eventName" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ends_at" TIMESTAMP(6) NOT NULL,
    "pointsForKilometre" INTEGER NOT NULL,
    "pointsForHour" INTEGER NOT NULL,
    "totalPointsToScore" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_records" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "PK_9a30ab4991c4b36e81d164cc3fe" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR NOT NULL,
    "activity" VARCHAR NOT NULL,
    "message" VARCHAR NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id")
);

