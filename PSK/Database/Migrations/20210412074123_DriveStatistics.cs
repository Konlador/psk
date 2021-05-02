using Microsoft.EntityFrameworkCore.Migrations;

namespace Database.Migrations
{
    public partial class DriveStatistics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "NumberOfFiles",
                table: "Drives",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "TotalStorageUsed",
                table: "Drives",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfFiles",
                table: "Drives");

            migrationBuilder.DropColumn(
                name: "TotalStorageUsed",
                table: "Drives");
        }
    }
}
