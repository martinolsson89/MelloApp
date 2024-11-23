using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MelloApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class changenametofinalpredictedplacement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FinalPlacement",
                table: "FinalPredictions",
                newName: "FinalPredictedPlacement");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FinalPredictedPlacement",
                table: "FinalPredictions",
                newName: "FinalPlacement");
        }
    }
}
