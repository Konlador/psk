using Microsoft.EntityFrameworkCore.Migrations;

namespace Database.Migrations
{
    public partial class TrashedState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Trashed",
                table: "StorageItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TrashedExplicitly",
                table: "StorageItems",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Trashed",
                table: "StorageItems");

            migrationBuilder.DropColumn(
                name: "TrashedExplicitly",
                table: "StorageItems");
        }
    }
}
