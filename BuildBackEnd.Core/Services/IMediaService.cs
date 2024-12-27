using Microsoft.AspNetCore.Http;

namespace BuildBackEnd.Core.Services
{
    public interface IMediaService
    {
        Task<string> UploadPdfAsync(IFormFile file, string _pdfFolderPath);
        Task<string> UploadSoundAync(IFormFile file, string _imageFolderPath);
        Task<string> UploadVideoAync(IFormFile file, string _imageFolderPath);
        Task<string> UploadImageAsync(IFormFile file, string _imageFolderPath);
        Task<IEnumerable<string>> BulkUploadImagesAsync(IEnumerable<IFormFile> files, string _imageFolderPath);
        Task<string> UploadBase64ImageAsync(string base64Image, string _imageFolderPath);
        string DeleteFile(string fileName, string fileFolderPath);
        string BulkDeleteFile(List<string> fileNames, string _fileFolderPath);

        Task<string> DownloadAndSaveImageAsync(string imageUrl, string _imageFolderPath);
        Task<IEnumerable<string>> BulkDownloadAndSaveImagesAsync(IEnumerable<string> imageUrls, string _imageFolderPath);
    }
}
