function decodeSpecialCharacters(text: string): string {
    if (!text) return '';
    
    return text
      // Handle multiple 'à' variations
      .replace(/Ã\x83\x83\x83\x83Ã\x83\x83\x82Ã\x83\x82Ã\x82Â /g, 'à')
      .replace(/Ã\x83/g, 'à')
      .replace(/Ã /g, 'à')
      .replace(/àààÃÂ/g, 'à')
      .replace(/ààà/g, 'à')
      .replace(/àÃÂ/g, 'à')
      
      // Handle 'á' variations
      .replace(/Ã¡/g, 'á')
      
      // Handle other common Italian special characters
      .replace(/Ã¨/g, 'è')
      .replace(/Ã©/g, 'é')
      .replace(/Ã¬/g, 'ì')
      .replace(/Ã­/g, 'í')
      .replace(/Ã²/g, 'ò')
      .replace(/Ã³/g, 'ó')
      .replace(/Ã¹/g, 'ù')
      .replace(/Ã¼/g, 'ü')
      
      // Clean up any remaining encoded sequences
      .replace(/Ã[A-Za-z\d]/g, '')
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      
      // Clean up any remaining ÃÂ sequences
      .replace(/ÃÂ/g, '')
      
      // Normalize multiple consecutive special characters
      .replace(/([àáèéìíòóùü])\1+/g, '$1')
      
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      
      // Final trim to remove any extra spaces
      .trim();
  }

  export { decodeSpecialCharacters };