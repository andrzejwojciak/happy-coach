import { MigrationInterface, QueryRunner } from "typeorm"

export class ini1684599590048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        "CREATE TABLE Persons (
            PersonID int,
            LastName varchar(255),
            FirstName varchar(255),
            Address varchar(255),
            City varchar(255)
        );"
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
