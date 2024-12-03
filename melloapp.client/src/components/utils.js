// utils.js
export const placementDisplayName = (placement) => {
    const placements = {
      1: '1:a plats',
      2: '2:a plats',
      3: '3:e plats',
      // Add more as needed
    };
    return placements[placement] || `Plats ${placement}`;
  };
  
  export const finalPlacementDisplayName = (placement) => {
    const placements = {
      1: 'Vinnare',
      2: 'Andra plats',
      3: 'Tredje plats',
      // Add more as needed
    };
    return placements[placement] || `Plats ${placement}`;
  };
  
  export const getPlacementColor = (placement) => {
    switch (placement) {
      case 1:
        return 'primary'; // Typically blue
      case 2:
        return 'secondary'; // Typically purple
      case 3:
        return 'success'; // Typically green
      default:
        return 'default';
    }
  };
  
  export const getFinalPlacementColor = (placement) => {
    switch (placement) {
      case 'Winner':
        return 'primary';
      case 'Second':
        return 'secondary';
      case 'Third':
        return 'success';
      default:
        return 'default';
    }
  };
  