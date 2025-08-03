import React, { useEffect, useState } from "react";
import { categoryMap } from "../data";

const useCategoryOptions = ({ productData }) => {
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  // displaying sub category names with conditions
  useEffect(() => {
    const category = productData?.itemCategory;
    if (category && categoryMap[category]) {
      setSubCategoryOptions(categoryMap[category]);
    } else {
      setSubCategoryOptions([]);
    }
  }, [productData?.itemCategory]);

  return { subCategoryOptions };
};

export default useCategoryOptions;
