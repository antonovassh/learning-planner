using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlanner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLearningGoalAndTaskModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LearningTaskEntity_Goals_LearningGoalEntityId",
                table: "LearningTaskEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LearningTaskEntity",
                table: "LearningTaskEntity");

            migrationBuilder.DropIndex(
                name: "IX_LearningTaskEntity_LearningGoalEntityId",
                table: "LearningTaskEntity");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "LearningTaskEntity");

            migrationBuilder.DropColumn(
                name: "LearningGoalEntityId",
                table: "LearningTaskEntity");

            migrationBuilder.RenameTable(
                name: "LearningTaskEntity",
                newName: "Tasks");

            migrationBuilder.RenameColumn(
                name: "HoursPerWeek",
                table: "Goals",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "Deadline",
                table: "Goals",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "EstimatedHours",
                table: "Tasks",
                newName: "Status");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Goals",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Goals",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Tasks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Tasks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "GoalId",
                table: "Tasks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_GoalId",
                table: "Tasks",
                column: "GoalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Goals_GoalId",
                table: "Tasks",
                column: "GoalId",
                principalTable: "Goals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Goals_GoalId",
                table: "Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_GoalId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "GoalId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "Tasks",
                newName: "LearningTaskEntity");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Goals",
                newName: "Deadline");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Goals",
                newName: "HoursPerWeek");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "LearningTaskEntity",
                newName: "EstimatedHours");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "LearningTaskEntity",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "LearningGoalEntityId",
                table: "LearningTaskEntity",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LearningTaskEntity",
                table: "LearningTaskEntity",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_LearningTaskEntity_LearningGoalEntityId",
                table: "LearningTaskEntity",
                column: "LearningGoalEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_LearningTaskEntity_Goals_LearningGoalEntityId",
                table: "LearningTaskEntity",
                column: "LearningGoalEntityId",
                principalTable: "Goals",
                principalColumn: "Id");
        }
    }
}
