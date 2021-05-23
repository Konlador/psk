using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Database.Migrations
{
    public partial class RowVersion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StorageItems_StorageItems_ParentId",
                table: "StorageItems");

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "StorageItems",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

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

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "StorageItems");

            migrationBuilder.AddForeignKey(
                name: "FK_StorageItems_StorageItems_ParentId",
                table: "StorageItems",
                column: "ParentId",
                principalTable: "StorageItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
