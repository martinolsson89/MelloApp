using System.ComponentModel;

namespace MelloApp.Server.Enums;

public enum ePlacement
{
    [Description("Final")] Final,

    [Description("Finalkval")] FinalKval,

    [Description("Åker Ut")] ÅkerUt
}

public enum eFinalPlacement
{
    [Description("Vinnare i finalen")] Vinnare,

    [Description("2a i finalen")] Tvåa
}