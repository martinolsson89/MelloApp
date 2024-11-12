using MelloApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
        public DbSet<Artist> Artists { get; set; }
        public DbSet<SubCompetition> SubCompetitions { get; set; }
        public DbSet<ResultOfSubCompetition> ResultsOfSubCompetitions { get; set; }
        public DbSet<ScoreAfterSubCompetition> ScoresAfterSubCompetitions { get; set; }
        public DbSet<Leaderboard> Leaderboards { get; set; }
        public DbSet<Prediction> Predictions { get; set; }
        public DbSet<FinalPrediction> FinalPredictions { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);  // Ensure Identity tables are configured

            // Configure the relationships and delete behaviors

            // Artist -> SubCompetition (many-to-one)
            modelBuilder.Entity<Artist>()
                .HasOne(a => a.SubCompetition)
                .WithMany(sc => sc.Artists)
                .HasForeignKey(a => a.SubCompetitionId)
                .OnDelete(DeleteBehavior.Cascade);

            // ResultOfSubCompetition -> Artist (many-to-one)
            modelBuilder.Entity<ResultOfSubCompetition>()
                .HasOne(r => r.Artist)
                .WithMany(a => a.Results)
                .HasForeignKey(r => r.ArtistId)
                .OnDelete(DeleteBehavior.Cascade);

            // ResultOfSubCompetition -> SubCompetition (many-to-one)
            modelBuilder.Entity<ResultOfSubCompetition>()
                .HasOne(r => r.SubCompetition)
                .WithMany(sc => sc.Results)
                .HasForeignKey(r => r.SubCompetitionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prediction -> User (many-to-one)
            modelBuilder.Entity<Prediction>()
                .HasOne(p => p.User)
                .WithMany(u => u.Predictions)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prediction -> Artist (many-to-one)
            modelBuilder.Entity<Prediction>()
                .HasOne(p => p.Artist)
                .WithMany(a => a.Predictions)
                .HasForeignKey(p => p.ArtistId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prediction -> SubCompetition (many-to-one)
            modelBuilder.Entity<Prediction>()
                .HasOne(p => p.SubCompetition)
                .WithMany(sc => sc.Predictions)
                .HasForeignKey(p => p.SubCompetitionId)
                .OnDelete(DeleteBehavior.Restrict);

            // ScoreAfterSubCompetition -> User (many-to-one)
            modelBuilder.Entity<ScoreAfterSubCompetition>()
                .HasOne(s => s.User)
                .WithMany(u => u.Scores)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ScoreAfterSubCompetition -> SubCompetition (many-to-one)
            modelBuilder.Entity<ScoreAfterSubCompetition>()
                .HasOne(s => s.SubCompetition)
                .WithMany(sc => sc.ScoresAfterSubCompetitions)
                .HasForeignKey(s => s.SubCompetitionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Leaderboard -> User (one-to-one)
            modelBuilder.Entity<Leaderboard>()
                .HasOne(l => l.User)
                .WithOne(u => u.Leaderboard)
                .HasForeignKey<Leaderboard>(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // FinalPrediction -> User (many-to-one)
            modelBuilder.Entity<FinalPrediction>()
                .HasOne(fp => fp.User)
                .WithMany(u => u.FinalPredictions)
                .HasForeignKey(fp => fp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // FinalPrediction -> Artist (many-to-one)
            modelBuilder.Entity<FinalPrediction>()
                .HasOne(fp => fp.Artist)
                .WithMany(a => a.FinalPredictions)
                .HasForeignKey(fp => fp.ArtistId)
                .OnDelete(DeleteBehavior.Cascade);

            // Add indexes to improve performance
            modelBuilder.Entity<Prediction>()
                .HasIndex(p => new { p.UserId, p.SubCompetitionId });

            // Configure Prediction.PredictedPlacement to store enum as string
            modelBuilder.Entity<Prediction>()
                .Property(p => p.PredictedPlacement)
                .HasConversion<string>();

            // Configure ResultOfSubCompetition.Placement to store enum as string
            modelBuilder.Entity<ResultOfSubCompetition>()
                .Property(r => r.Placement)
                .HasConversion<string>();

            // Configure FinalPrediction.PredictedPlacement to store enum as string
            modelBuilder.Entity<FinalPrediction>()
                .Property(fp => fp.FinalPlacement)
                .HasConversion<string>();
    }
}
