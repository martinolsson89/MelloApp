using AutoMapper;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;

namespace MelloApp.Server.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        //CreateMap<Artist, ArtistDto.GetArtistDto>();
        //CreateMap<Artist, ArtistDto.AddArtistDto>();
        //CreateMap<Artist, ArtistDto.UpdateArtistDto>();
        //CreateMap<ArtistDto.DeleteArtistDto, Artist>();
        CreateMap<SubCompetition, GetSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, AddSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, UpdateSubCompetitionDto>().ReverseMap();
        CreateMap<SubCompetition, DeleteSubCompetitionDto>().ReverseMap();
    }
}