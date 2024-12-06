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


    public class ArtistRepositoryTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllArtists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            var artists = new List<Artist>
            {
                new Artist { Id = "1", Name = "Artist1", Song = "Song1", SubCompetitionId  = "sub1"},
                new Artist { Id = "2", Name = "Artist2", Song = "Song2", SubCompetitionId = "sub2"}
            };

            await context.Artists.AddRangeAsync(artists);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, a => a.Name == "Artist1");
            Assert.Contains(result, a => a.Name == "Artist2");
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnArtist_WhenArtistExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            var artist = new Artist { Id = "1", Name = "Artist1", Song = "Song1", SubCompetitionId = "sub1"};
            await context.Artists.AddAsync(artist);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetByIdAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Artist1", result.Name);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenArtistDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            // Act
            var result = await repository.GetByIdAsync("NonExistentId");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_ShouldAddNewArtist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            var artist = new Artist { Id = "1", Name = "Artist1", Song = "Song1", SubCompetitionId = "sub1"};

            // Act
            var result = await repository.CreateAsync(artist);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, context.Artists.Count());
            Assert.Equal("Artist1", context.Artists.First().Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateExistingArtist_WhenArtistExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            var artist = new Artist { Id = "1", Name = "Artist1", Song = "Song1", SubCompetitionId = "sub1"};
            await context.Artists.AddAsync(artist);
            await context.SaveChangesAsync();

            var updatedArtist = new Artist { Name = "UpdatedArtist", Song = "UpdatedSong" };

            // Act
            var result = await repository.UpdateAsync("1", updatedArtist);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("UpdatedArtist", result.Name);
            Assert.Equal("UpdatedSong", result.Song);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenArtistDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            var updatedArtist = new Artist { Name = "UpdatedArtist", Song = "UpdatedSong" };

            // Act
            var result = await repository.UpdateAsync("NonExistentId", updatedArtist);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveArtist_WhenArtistExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            var artist = new Artist { Id = "1", Name = "Artist1", Song = "Song1" , SubCompetitionId = "sub1" };
            await context.Artists.AddAsync(artist);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.DeleteAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Artist1", result.Name);
            Assert.Equal(0, context.Artists.Count());
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnNull_WhenArtistDoesNotExist()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repository = new ArtistRepository(context);

            // Act
            var result = await repository.DeleteAsync("NonExistentId");

            // Assert
            Assert.Null(result);
        }
    }

