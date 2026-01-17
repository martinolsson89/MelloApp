namespace MelloApp.Server.Services;

public sealed class SubCompetitionSeedDto
{
    public string Name { get; set; } = default!;
    public string Location { get; set; } = default!;
    public DateTime Date { get; set; }
}

public sealed class ArtistSeedDto
{
    public string Name { get; set; } = default!;
    public string Song { get; set; } = default!;
    public string ImageUrl { get; set; } = default!;
    public string SubCompetitionName { get; set; } = default!;
    public int StartingNumber { get; set; }
}
