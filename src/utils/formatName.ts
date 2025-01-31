export const formatName = (name: string, lastname: string): string => {
    const capitalize = (text: string) => 
      text
        .split(" ") // Divide el string en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palabra
        .join(" "); // Une las palabras de nuevo
  
    return `${capitalize(name)} ${capitalize(lastname)}`;
  };