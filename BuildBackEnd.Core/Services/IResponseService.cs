using BuildBackEnd.Core.Response;

namespace BuildBackEnd.Core.Services
{
    public interface IResponseService
    {
        ResponseAjax HandleSuccess(string message);
        ResponseAjax HandleSuccessData(string message, object data = null);
        ResponseAjax HandleError(string message);
    }
}
