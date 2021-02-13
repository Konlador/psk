using Microsoft.EntityFrameworkCore;

namespace Database
{
    public class DatabaseContext : DbContext
        {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base (options) { }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Post> Posts { get; set; }
        }
    }