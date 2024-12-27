using BuildBackEnd.Core.Services;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;


namespace BuildBackEnd.Service.Services
{
    public class MediaService : IMediaService
    {

        public async Task<string> UploadPdfAsync(IFormFile file, string _pdfFolderPath)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Dosya bulunamadı.");

            var fileName = $"{DateTime.UtcNow:yyyy-MM-dd}_{Guid.NewGuid()}.pdf";
            var filePath = Path.Combine(_pdfFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName; // Yüklenen dosyanın adını döndür
        }




        public async Task<string> UploadVideoAync(IFormFile file, string _imageFolderPath)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Dosya bulunamadı.");

            var fileName = $"{DateTime.UtcNow:yyyy-MM-dd}_{Guid.NewGuid()}.mp4";
            var filePath = Path.Combine(_imageFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName; // Çift tırnak işaretlerini kaldır // Sadece dosya adını döndür
        }

        public async Task<string> UploadSoundAync(IFormFile file, string _imageFolderPath)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Dosya bulunamadı.");

            var fileName = $"{DateTime.UtcNow:yyyy-MM-dd}_{Guid.NewGuid()}.mp3";
            var filePath = Path.Combine(_imageFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName; // Çift tırnak işaretlerini kaldır // Sadece dosya adını döndür
        }



        public async Task<string> UploadImageAsync(IFormFile file, string _imageFolderPath)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Dosya bulunamadı.");

            var fileName = $"{DateTime.UtcNow:yyyy-MM-dd}_{Guid.NewGuid()}.webp";
            var filePath = Path.Combine(_imageFolderPath, fileName);

            using (var image = Image.Load(file.OpenReadStream()))
            {
                await image.SaveAsWebpAsync(filePath);
            }

            return fileName; // Yüklenen dosyanın adını döndür
        }

        public async Task<IEnumerable<string>> BulkUploadImagesAsync(IEnumerable<IFormFile> files, string _imageFolderPath)
        {
            var uploadedFileNames = new List<string>();

            foreach (var file in files)
            {
                var fileName = await UploadImageAsync(file, _imageFolderPath);
                uploadedFileNames.Add(fileName);
            }

            return uploadedFileNames; // Yüklenen dosyaların adlarını döndür
        }

        public async Task<string> UploadBase64ImageAsync(string base64Image, string _imageFolderPath)
        {
            if (string.IsNullOrEmpty(base64Image))
                throw new ArgumentException("Geçersiz resim verisi.");


            var dataIndex = base64Image.IndexOf("base64,", StringComparison.OrdinalIgnoreCase);
            if (dataIndex > -1)
            {
                base64Image = base64Image.Substring(dataIndex + 7);
            }

            var imageBytes = Convert.FromBase64String(base64Image);
            var fileName = $"{DateTime.UtcNow:yyyy-MM-dd}_{Guid.NewGuid()}.webp";
            var filePath = Path.Combine(_imageFolderPath, fileName);

            using (var image = Image.Load(imageBytes))
            {
                await image.SaveAsWebpAsync(filePath);
            }

            return fileName; // Yüklenen dosyanın adını döndür
        }

        public string DeleteFile(string fileName, string fileFolderPath)
        {
            try
            {
                var filePath = Path.Combine(fileFolderPath, fileName);
                if (File.Exists(filePath))
                    File.Delete(filePath);

                return "Successfully Deleted!";
            }
            catch (Exception ex)
            {
                var message = "Bir hata oluştu: " + ex.Message;

                if (ex.InnerException != null)
                {
                    message += " İç hata: " + ex.InnerException.Message;
                }
                return message;

            }

        }

        public string BulkDeleteFile(List<string> fileNames, string _fileFolderPath)
        {
            try
            {
                foreach (var name in fileNames)
                    DeleteFile(name, _fileFolderPath);
                return "Successfully Deleted!";
            }
            catch (Exception ex)
            {
                var message = "Bir hata oluştu: " + ex.Message;

                if (ex.InnerException != null)
                {
                    message += " İç hata: " + ex.InnerException.Message;
                }
                return message;

            }


        }




        public async Task<string> DownloadAndSaveImageAsync(string imageUrl, string _imageFolderPath)
        {
            using (var httpClient = new HttpClient())
            {
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                var fileName = $"{DateTime.UtcNow:yyyy-MM-dd}_{Guid.NewGuid()}.webp";
                var filePath = Path.Combine(_imageFolderPath, fileName);

                using (var image = Image.Load(imageBytes))
                    await image.SaveAsWebpAsync(filePath);


                return fileName; // Yüklenen dosyanın adını döndür
            }
        }

        public async Task<IEnumerable<string>> BulkDownloadAndSaveImagesAsync(IEnumerable<string> imageUrls, string _imageFolderPath)
        {
            var uploadedFileNames = new List<string>();

            foreach (var imageUrl in imageUrls)
            {
                var fileName = await DownloadAndSaveImageAsync(imageUrl, _imageFolderPath);
                uploadedFileNames.Add(fileName);
            }

            return uploadedFileNames; // Yüklenen dosyaların adlarını döndür
        }


    }

}

