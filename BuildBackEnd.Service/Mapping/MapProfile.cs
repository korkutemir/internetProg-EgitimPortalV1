using AutoMapper;
using BuildBackEnd.Core.Models;
using BuildBackEnd.Core.viewModels;


namespace BuildBackEnd.Service.Mapping
{
    public class MapProfile : Profile
    {
        public MapProfile()
        {




            CreateMap<CategoryVM, Categories>().ReverseMap();
            CreateMap<CategoryUpdateVM, Categories>().ReverseMap();



            CreateMap<InstructorVM, Instructors>().ReverseMap();
            CreateMap<InstructorUpdateVM, Instructors>().ReverseMap();


            CreateMap<CourseVM, Courses>().ReverseMap();
            CreateMap<CourseUpdateVM, Courses>().ReverseMap();


            // AutoMapper konfigürasyonunda
            //CreateMap<SectionDetails, Products>();
            //CreateMap<AnnotationDetails, Annotations>();

            //       CreateMap<ProductDetails, Products>()
            //.ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));


        }
    }
}
