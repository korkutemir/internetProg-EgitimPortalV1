namespace BuildBackEnd.Core.TableModels
{
    public class DataTableModel
    {
        //int draw, int start, int length, string orderColumnName, string orderDir, [FromForm] Search search

        public int draw { get; set; }
        public int start { get; set; }
        public int lenght { get; set; }
        public string orderColumnName { get; set; }
        public string orderDir { get; set; }
        public Search? search { get; set; }
    }
}
