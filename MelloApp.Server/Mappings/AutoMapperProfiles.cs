using AutoMapper;
using MelloApp.Server.Data;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Account;
using MelloApp.Server.Models.Dto;

namespace MelloApp.Server.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Artist, GetArtistDto>().ReverseMap();
        CreateMap<Artist, AddArtistDto>().ReverseMap();
        CreateMap<Artist, UpdateArtistDto>().ReverseMap();
        CreateMap<Artist, DeleteArtistDto>().ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, AddSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, UpdateSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, DeleteSubCompetitionDto>().ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionDto>()
            .ForMember(dest => dest.Artists, opt => opt.MapFrom(src => src.Artists))
            .ReverseMap();

        CreateMap<Artist, GetArtistDto>().ReverseMap();



        CreateMap<Leaderboard, GetLeaderboardDto>().ReverseMap();
        CreateMap<Leaderboard, AddLeaderboardDto>().ReverseMap();
        CreateMap<Leaderboard, UpdateLeaderboardDto>().ReverseMap();
        CreateMap<Leaderboard, DeleteLeaderboardDto>().ReverseMap();

        CreateMap<Prediction, GetPredictionDto>().ReverseMap();
        CreateMap<Prediction, AddPredictionDto>().ReverseMap();
        CreateMap<Prediction, UpdatePredictionDto>().ReverseMap();
        CreateMap<Prediction, DeletePredictionDto>().ReverseMap();

        // ResultOfSubCompetition
        CreateMap<ResultOfSubCompetition, GetResultOfSubCompetitionDto>().ReverseMap();
        CreateMap<ResultOfSubCompetition, AddResultOfSubCompetitionDto>().ReverseMap();
        CreateMap<ResultOfSubCompetition, UpdateResultOfSubCompetitionDto>().ReverseMap();
        CreateMap<ResultOfSubCompetition, DeleteResultOfSubCompetitionDto>().ReverseMap();

        // ScoreAfterSubCompetition
        CreateMap<ScoreAfterSubCompetition, GetScoreAfterSubCompetitionDto>().ReverseMap();
        CreateMap<ScoreAfterSubCompetition, AddScoreAfterSubCompetitionDto>().ReverseMap();
        CreateMap<ScoreAfterSubCompetition, UpdateScoreAfterSubCompetitionDto>().ReverseMap();
        CreateMap<ScoreAfterSubCompetition, DeleteScoreAfterSubCompetitionDto>().ReverseMap();

        // ApplicationUser UserDto
        CreateMap<ApplicationUser, UserDto>().ReverseMap();
        

    }
}