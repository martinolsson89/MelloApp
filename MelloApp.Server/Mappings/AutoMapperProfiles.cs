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
        CreateMap<Artist, ArtistDto>().ReverseMap();
        CreateMap<Artist, GetArtistDto>().ReverseMap();
        CreateMap<Artist, AddArtistDto>().ReverseMap();
        CreateMap<Artist, UpdateArtistDto>().ReverseMap();
        CreateMap<Artist, DeleteArtistDto>().ReverseMap();

        CreateMap<SubCompetition, SubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, GetSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, AddSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, UpdateSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, DeleteSubCompetitionDto>().ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionAndArtistsDto>()
            .ForMember(dest => dest.Artists, opt => opt.MapFrom(src => src.Artists))
            .ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionAndPredictionsDto>()
            .ForMember(dest => dest.Predictions, opt => opt.MapFrom(src => src.Predictions))
            .ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionAndResultsDto>()
            .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results))
            .ReverseMap();

        // Map Prediction to PredictionDto
        CreateMap<Prediction, PredictionWithUserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.PredictedPlacement, opt => opt.MapFrom(src => src.PredictedPlacement))
            .ReverseMap();

        CreateMap<ResultOfSubCompetition, ResultOfSubCompetitionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.Placement, opt => opt.MapFrom(src => src.Placement))
            .ReverseMap();


        CreateMap<Leaderboard, GetLeaderboardDto>().ReverseMap();
        CreateMap<Leaderboard, AddLeaderboardDto>().ReverseMap();
        CreateMap<Leaderboard, UpdateLeaderboardDto>().ReverseMap();
        CreateMap<Leaderboard, DeleteLeaderboardDto>().ReverseMap();


        CreateMap<Prediction, PredictionDto>()
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.SubCompetition, opt => opt.MapFrom(src => src.SubCompetition))
            .ReverseMap();

        CreateMap<Prediction, GetPredictionDto>().ReverseMap();
        CreateMap<Prediction, AddPredictionDto>().ReverseMap();
        CreateMap<Prediction, UpdatePredictionDto>().ReverseMap();
        CreateMap<Prediction, DeletePredictionDto>().ReverseMap();
        CreateMap<Prediction, AddBatchPredictionDto>().ReverseMap();

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

        // Map ApplicationUser to UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.Predictions, opt => opt.MapFrom(src => src.Predictions))
            .ReverseMap();

        // Map ApplicationUser to UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.Predictions, opt => opt.MapFrom(src => src.Predictions))
            .ForMember(dest => dest.FinalPredictions, opt => opt.MapFrom(src => src.FinalPredictions))
            .ReverseMap();

        // Map FinalPrediction to FinalPredictionDto
        CreateMap<FinalPrediction, GetFinalPredictionDto>().ReverseMap();
        CreateMap<FinalPrediction, AddFinalPredictionDto>().ReverseMap();
        CreateMap<FinalPrediction, UpdateSubCompetitionDto>().ReverseMap();
        CreateMap<FinalPrediction, DeleteFinalPredictionDto>().ReverseMap();

        CreateMap<FinalPrediction, GetFinalPredictionDtoWithUser>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.FinalPlacement, opt => opt.MapFrom(src => src.FinalPlacement))
            .ReverseMap();

        CreateMap<FinalPrediction, FinalPredictionDto>()
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.SubCompetition, opt => opt.MapFrom(src => src.SubCompetition))
            .ReverseMap();

        CreateMap<FinalPrediction, AddBatchFinalPredictionDto>().ReverseMap();

    }
}