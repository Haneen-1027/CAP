using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssessmentsQuestions_Assessments_AssessmentId",
                table: "AssessmentsQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_AssessmentsQuestions_Questions_QuestionId",
                table: "AssessmentsQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_TestCase_CodingQuestions_CodingQuestionId",
                table: "TestCase");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TestCase",
                table: "TestCase");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AssessmentsQuestions",
                table: "AssessmentsQuestions");

            migrationBuilder.RenameTable(
                name: "TestCase",
                newName: "TestCases");

            migrationBuilder.RenameTable(
                name: "AssessmentsQuestions",
                newName: "AssessmentQuestions");

            migrationBuilder.RenameIndex(
                name: "IX_TestCase_CodingQuestionId",
                table: "TestCases",
                newName: "IX_TestCases_CodingQuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_AssessmentsQuestions_QuestionId",
                table: "AssessmentQuestions",
                newName: "IX_AssessmentQuestions_QuestionId");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CodingQuestions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Assessments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Assessments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Mark",
                table: "AssessmentQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestCases",
                table: "TestCases",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AssessmentQuestions",
                table: "AssessmentQuestions",
                columns: new[] { "AssessmentId", "QuestionId" });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AssessmentQuestions_Assessments_AssessmentId",
                table: "AssessmentQuestions",
                column: "AssessmentId",
                principalTable: "Assessments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AssessmentQuestions_Questions_QuestionId",
                table: "AssessmentQuestions",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestCases_CodingQuestions_CodingQuestionId",
                table: "TestCases",
                column: "CodingQuestionId",
                principalTable: "CodingQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssessmentQuestions_Assessments_AssessmentId",
                table: "AssessmentQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_AssessmentQuestions_Questions_QuestionId",
                table: "AssessmentQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_CodingQuestions_CodingQuestionId",
                table: "TestCases");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TestCases",
                table: "TestCases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AssessmentQuestions",
                table: "AssessmentQuestions");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "CodingQuestions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "Mark",
                table: "AssessmentQuestions");

            migrationBuilder.RenameTable(
                name: "TestCases",
                newName: "TestCase");

            migrationBuilder.RenameTable(
                name: "AssessmentQuestions",
                newName: "AssessmentsQuestions");

            migrationBuilder.RenameIndex(
                name: "IX_TestCases_CodingQuestionId",
                table: "TestCase",
                newName: "IX_TestCase_CodingQuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_AssessmentQuestions_QuestionId",
                table: "AssessmentsQuestions",
                newName: "IX_AssessmentsQuestions_QuestionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestCase",
                table: "TestCase",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AssessmentsQuestions",
                table: "AssessmentsQuestions",
                columns: new[] { "AssessmentId", "QuestionId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AssessmentsQuestions_Assessments_AssessmentId",
                table: "AssessmentsQuestions",
                column: "AssessmentId",
                principalTable: "Assessments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AssessmentsQuestions_Questions_QuestionId",
                table: "AssessmentsQuestions",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestCase_CodingQuestions_CodingQuestionId",
                table: "TestCase",
                column: "CodingQuestionId",
                principalTable: "CodingQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
