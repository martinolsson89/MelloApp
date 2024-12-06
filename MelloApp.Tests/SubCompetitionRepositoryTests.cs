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

    public class SubCompetitionRepositoryTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllSubCompetitions()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var subCompetitions = new List<SubCompetition>
            {
                new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now },
                new SubCompetition { Id = "2", Name = "SubCompetition2", Date = DateTime.Now.AddDays(1) }
            };

            await context.SubCompetitions.AddRangeAsync(subCompetitions);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("SubCompetition1", result.First().Name);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnSubCompetition_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var subCompetition = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };
            await context.SubCompetitions.AddAsync(subCompetition);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetByIdAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("SubCompetition1", result.Name);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            // Act
            var result = await repository.GetByIdAsync("NonExistentId");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_ShouldAddNewSubCompetition()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var subCompetition = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };

            // Act
            var result = await repository.CreateAsync(subCompetition);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, context.SubCompetitions.Count());
            Assert.Equal("SubCompetition1", context.SubCompetitions.First().Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateSubCompetition_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var subCompetition = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };
            await context.SubCompetitions.AddAsync(subCompetition);
            await context.SaveChangesAsync();

            var updatedSubCompetition = new SubCompetition { Name = "UpdatedSubCompetition", Date = DateTime.Now.AddDays(1) };

            // Act
            var result = await repository.UpdateAsync("1", updatedSubCompetition);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("UpdatedSubCompetition", result.Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var updatedSubCompetition = new SubCompetition { Name = "UpdatedSubCompetition", Date = DateTime.Now.AddDays(1) };

            // Act
            var result = await repository.UpdateAsync("NonExistentId", updatedSubCompetition);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveSubCompetition_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var subCompetition = new SubCompetition { Id = "1", Name = "SubCompetition1", Date = DateTime.Now };
            await context.SubCompetitions.AddAsync(subCompetition);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.DeleteAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, context.SubCompetitions.Count());
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnNull_WhenDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            // Act
            var result = await repository.DeleteAsync("NonExistentId");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetSubCompetitionsWithArtistsAsync_ShouldIncludeArtists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new SubCompetitionRepository(context);

            var artist = new Artist { Id = "1", Name = "Artist1", StartingNumber = 1, Song = "song1"};
            var subCompetition = new SubCompetition
            {
                Id = "1",
                Name = "SubCompetition1",
                Date = DateTime.Now,
                Artists = new List<Artist> { artist }
            };

            await context.SubCompetitions.AddAsync(subCompetition);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetSubCompetitionsWithArtistsAsync();

            // Assert
            Assert.NotEmpty(result);
            Assert.NotEmpty(result.First().Artists);
        }
    }
