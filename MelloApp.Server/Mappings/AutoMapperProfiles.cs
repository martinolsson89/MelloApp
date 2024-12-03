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

        CreateMap<Artist, ArtistWithPredictionsDto>().ReverseMap();


        CreateMap<SubCompetition, SubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, GetSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, AddSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, UpdateSubCompetitionDto>().ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionNameDto>().ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionAndArtistsDto>()
            .ForMember(dest => dest.Artists, opt => opt.MapFrom(src => src.Artists))
            .ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionAndPredictionsDto>()
            .ForMember(dest => dest.Predictions, opt => opt.MapFrom(src => src.Predictions))
            .ReverseMap();

        CreateMap<SubCompetition, GetSubCompetitionAndResultsDto>()
            .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results))
            .ReverseMap();


        CreateMap<SubCompetition, GetSubCompetitionWithArtistsAndPredictionsDto>().ReverseMap();
        CreateMap<SubCompetition, GetSubCompetitionWithArtistsPredictionsAndResultsDto>().ReverseMap();



        // Map Prediction to PredictionDto
        CreateMap<Prediction, PredictionWithUserAndArtistDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.PredictedPlacement, opt => opt.MapFrom(src => src.PredictedPlacement))
            .ReverseMap();

        CreateMap<ResultOfSubCompetition, ResultOfSubCompetitionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.Placement, opt => opt.MapFrom(src => src.Placement))
            .ForMember(dest => dest.FinalPlacement, opt => opt.MapFrom(src => src.FinalPlacement))
            .ReverseMap();


        CreateMap<Leaderboard, GetLeaderboardDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ReverseMap();
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

        CreateMap<Prediction, PredictionWithUserDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ReverseMap();


        // ResultOfSubCompetition
        CreateMap<ResultOfSubCompetition, GetResultOfSubCompetitionDto>().ReverseMap();
        CreateMap<ResultOfSubCompetition, AddResultOfSubCompetitionDto>().ReverseMap();
        CreateMap<ResultOfSubCompetition, UpdateResultOfSubCompetitionDto>().ReverseMap();
        CreateMap<ResultOfSubCompetition, DeleteResultOfSubCompetitionDto>().ReverseMap();

        CreateMap<ResultOfSubCompetition, AddBatchResultOfSubCompetitionDto>().ReverseMap();

        CreateMap<ResultOfSubCompetition, UpdateBatchResultOfSubCompetitionDto>().ReverseMap();

        // ScoreAfterSubCompetition
        //CreateMap<ScoreAfterSubCompetition, GetScoreAfterSubCompetitionDto>()
        //    .ForMember(dest => dest.SubCompetitionName, opt => opt.MapFrom(src => src.SubCompetition))
        //    .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
        //    .ReverseMap();


        CreateMap<ScoreAfterSubCompetition, GetScoreAfterSubCompetitionDto>().ReverseMap();
        CreateMap<ScoreAfterSubCompetition, AddScoreAfterSubCompetitionDto>().ReverseMap();
        CreateMap<ScoreAfterSubCompetition, UpdateScoreAfterSubCompetitionDto>().ReverseMap();
        CreateMap<ScoreAfterSubCompetition, DeleteScoreAfterSubCompetitionDto>().ReverseMap();

        CreateMap<ScoreAfterSubCompetition, GetUserScoreDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.SubCompetitionName, opt => opt.MapFrom(src => src.SubCompetition))
            .ReverseMap();

        // ApplicationUser UserDto
        CreateMap<ApplicationUser, GetUserDto>().ReverseMap();
        CreateMap<ApplicationUser, UserDto>().ReverseMap();
        CreateMap<ApplicationUser, UserNamesDto>().ReverseMap();
        CreateMap<ApplicationUser, UpdateUserInfoDto>().ReverseMap();

        // UpdateUserAvatarDto
        CreateMap<ApplicationUser, UpdateUserAvatarDto>().ReverseMap();

        // Map ApplicationUser to UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.Predictions, opt => opt.MapFrom(src => src.Predictions))
            .ReverseMap();

        // Map ApplicationUser to UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.Predictions, opt => opt.MapFrom(src => src.Predictions))
            .ForMember(dest => dest.FinalPredictions, opt => opt.MapFrom(src => src.FinalPredictions))
            .ReverseMap();

        CreateMap<ApplicationUser, UpdateAvatarDto>().ReverseMap();

        // Map FinalPrediction to FinalPredictionDto
        CreateMap<FinalPrediction, GetFinalPredictionDto>().ReverseMap();
        CreateMap<FinalPrediction, AddFinalPredictionDto>().ReverseMap();
        CreateMap<FinalPrediction, UpdateSubCompetitionDto>().ReverseMap();
        CreateMap<FinalPrediction, DeleteFinalPredictionDto>().ReverseMap();

        CreateMap<FinalPrediction, GetFinalPredictionDtoWithUser>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.FinalPredictedPlacement, opt => opt.MapFrom(src => src.FinalPredictedPlacement))
            .ReverseMap();

        CreateMap<FinalPrediction, FinalPredictionDto>()
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.SubCompetition, opt => opt.MapFrom(src => src.SubCompetition))
            .ReverseMap();

        CreateMap<FinalPrediction, AddBatchFinalPredictionDto>().ReverseMap();

        //Mapping for SubCompetition Leaderboards

        // Mapping from ScoreAfterSubCompetition to UserScoreDto
        CreateMap<ScoreAfterSubCompetition, UserScoreDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
            .ForMember(dest => dest.AvatarImageUrl, opt => opt.MapFrom(src => src.User.AvatarImageUrl))
            .ForMember(dest => dest.Points, opt => opt.MapFrom(src => src.Points));

// Mapping from SubCompetition to SubCompetitionWithScoresDto
        CreateMap<SubCompetition, SubCompetitionWithScoresDto>()
            .ForMember(dest => dest.SubCompetitionId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
            .ForMember(dest => dest.UserScores, opt => opt.MapFrom(src => src.ScoresAfterSubCompetitions))
            .AfterMap((src, dest) =>
            {
                // Order the UserScores by Points descending
                dest.UserScores = dest.UserScores.OrderByDescending(u => u.Points).ToList();
            });


    }
}