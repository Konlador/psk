using Microsoft.EntityFrameworkCore.Migrations;

namespace Database.Migrations
{
    public partial class Folders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "StorageItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "StorageItem");

            migrationBuilder.CreateIndex(
                name: "IX_StorageItems_ParentId",
                table: "StorageItems",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_StorageItems_StorageItems_ParentId",
                table: "StorageItems",
                column: "ParentId",
                principalTable: "StorageItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StorageItems_StorageItems_ParentId",
                table: "StorageItems");

            migrationBuilder.DropIndex(
                name: "IX_StorageItems_ParentId",
                table: "StorageItems");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "StorageItems");
        }
    }
}
