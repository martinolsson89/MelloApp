namespace MelloApp.Tests;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using global::MelloApp.Server.Data;
using global::MelloApp.Server.Models;
using global::MelloApp.Server.Repositories;
using MelloApp.Server.Data;
using MelloApp.Server.Models;
using MelloApp.Server.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

    public class ScoreAfterSubCompetitionRepositoryTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllScores()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var subCompetition1 = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };
        var subCompetition2 = new SubCompetition { Id = "2", Name = "SubCompetition2", Date = DateTime.Now.AddDays(1) };

        var scores = new List<ScoreAfterSubCompetition>
            {
                new ScoreAfterSubCompetition { Id = "1", Points = 10, SubCompetition = subCompetition1, SubCompetitionId = "1", UserId = "1"},
                new ScoreAfterSubCompetition { Id = "2", Points = 20, SubCompetition = subCompetition2, SubCompetitionId = "2", UserId = "2"}
            };

            await context.SubCompetitions.AddAsync(subCompetition1);
            await context.ScoresAfterSubCompetitions.AddRangeAsync(scores);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.Points == 10);
            Assert.Contains(result, s => s.Points == 20);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnScore_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var score = new ScoreAfterSubCompetition { Id = "1", Points = 10, SubCompetitionId = "1", UserId = "1"};
            await context.ScoresAfterSubCompetitions.AddAsync(score);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetByIdAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(10, result.Points);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            // Act
            var result = await repository.GetByIdAsync("NonExistentId");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_ShouldAddNewScore()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var score = new ScoreAfterSubCompetition { Id = "1", Points = 10, SubCompetitionId = "1", UserId = "1"};

            // Act
            var result = await repository.CreateAsync(score);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, context.ScoresAfterSubCompetitions.Count());
            Assert.Equal(10, context.ScoresAfterSubCompetitions.First().Points);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateScore_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var score = new ScoreAfterSubCompetition {Id = "1", Points = 10, SubCompetitionId = "1", UserId = "1" };
            await context.ScoresAfterSubCompetitions.AddAsync(score);
            await context.SaveChangesAsync();

            var updatedScore = new ScoreAfterSubCompetition { Points = 20 };

            // Act
            var result = await repository.UpdateAsync("1", updatedScore);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(20, result.Points);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var updatedScore = new ScoreAfterSubCompetition { Points = 20 };

            // Act
            var result = await repository.UpdateAsync("NonExistentId", updatedScore);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveScore_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var score = new ScoreAfterSubCompetition {Id = "1", Points = 10, SubCompetitionId = "1", UserId = "1" };
            await context.ScoresAfterSubCompetitions.AddAsync(score);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.DeleteAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, context.ScoresAfterSubCompetitions.Count());
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnNull_WhenDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            // Act
            var result = await repository.DeleteAsync("NonExistentId");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetScoresGroupedBySubCompetitionAsync_ShouldReturnScoresGroupedBySubCompetition()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var subCompetition1 = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };
        var subCompetition2 = new SubCompetition { Id = "2", Name = "SubCompetition2", Date = DateTime.Now.AddDays(1) };
        var scores = new List<ScoreAfterSubCompetition>
            {
                new ScoreAfterSubCompetition { Id = "1", Points = 10, SubCompetition = subCompetition1, SubCompetitionId = "1", UserId = "1"},
                new ScoreAfterSubCompetition { Id = "2", Points = 20, SubCompetition = subCompetition2, SubCompetitionId = "2", UserId = "2"}
            };

            await context.SubCompetitions.AddAsync(subCompetition1);
            await context.ScoresAfterSubCompetitions.AddRangeAsync(scores);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetScoresGroupedBySubCompetitionAsync();

            // Assert
            Assert.NotEmpty(result);
            Assert.NotEmpty(result.First().ScoresAfterSubCompetitions);
        }

        [Fact]
        public async Task GetUserScoresAsync_ShouldReturnUserScoresOrderedBySubCompetitionDate()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ScoreAfterSubCompetitionRepository(context);

            var subCompetition1 = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };
            var subCompetition2 = new SubCompetition { Id = "2", Name = "SubCompetition2", Date = DateTime.Now.AddDays(1) };

            var scores = new List<ScoreAfterSubCompetition>
            {
                new ScoreAfterSubCompetition {Id = "1", Points = 10, SubCompetition = subCompetition2, SubCompetitionId = "1", UserId = "1"},
                new ScoreAfterSubCompetition {Id = "2", Points = 20, SubCompetition = subCompetition1, SubCompetitionId = "2", UserId = "2"}
            };

            await context.SubCompetitions.AddRangeAsync(subCompetition1, subCompetition2);
            await context.ScoresAfterSubCompetitions.AddRangeAsync(scores);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetUserScoresAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("SubCompetition1", result.First().SubCompetition.Name);
        }
    }

