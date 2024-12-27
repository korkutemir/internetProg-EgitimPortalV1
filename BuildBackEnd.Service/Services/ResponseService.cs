using BuildBackEnd.Core.Response;
using BuildBackEnd.Core.Services;

namespace BuildBackEnd.Service.Services
{
    public class ResponseService : IResponseService
    {
        public ResponseAjax HandleSuccess(string message)
        {
            return new ResponseAjax(true, message);
        }

        public ResponseAjax HandleSuccessData(string message, object data = null)
        {
            return new ResponseAjax(true, message, data);
        }

        public ResponseAjax HandleError(string message)
        {
            return new ResponseAjax(false, message);
        }
    }
}
