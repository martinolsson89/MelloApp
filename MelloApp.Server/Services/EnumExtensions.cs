namespace MelloApp.Server.Services;

using MelloApp.Server.Enums;
using System;
using System.ComponentModel;
using System.Reflection;

public static class EnumExtensions
{
    public static string GetDescription(this Enum enumValue)
    {
        FieldInfo fi = enumValue.GetType().GetField(enumValue.ToString());

        if (fi != null)
        {
            DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);

            if (attributes.Length > 0)
                return attributes[0].Description;
        }

        // Return the enum member name if no description is found
        return enumValue.ToString();
    }
}

// Helper method to get description
//public static string GetDescription(this Enum value)
//{
//    var field = value.GetType().GetField(value.ToString());
//    var attribute = field.GetCustomAttribute<DescriptionAttribute>();
//    return attribute == null ? value.ToString() : attribute.Description;
//}

// Usage:
// ePlacement placement = ePlacement.SemiFinal;
// string displayName = placement.GetDescription();  // "Semi Final"