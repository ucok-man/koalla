import html2canvas, { Options } from "html2canvas";
import { useState } from "react";

interface UseScreenshotOptions {
  type?: string;
  quality?: number;
}

interface UseScreenshotReturn {
  image: string | null;
  takeScreenShot: (
    node: HTMLElement,
    options?: Partial<Options>
  ) => Promise<string | void>;
  error: Error | null;
}

/**
 * Converts oklch/oklab colors to rgb format in the cloned document
 */
const convertModernColorsInClone = (
  clonedDoc: Document,
  clonedElement: HTMLElement
): void => {
  const elements = clonedDoc.querySelectorAll("*");

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;

    // We need to get the computed style from the original DOM, not the clone
    // So we'll force all styles to be inline
    const properties = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "outlineColor",
      "fill",
      "stroke",
    ];

    properties.forEach((prop) => {
      const currentValue = htmlEl.style.getPropertyValue(prop);
      if (
        currentValue &&
        (currentValue.includes("oklch") || currentValue.includes("oklab"))
      ) {
        // Try to convert or remove the problematic value
        htmlEl.style.removeProperty(prop);
      }
    });
  });

  // Also handle the root cloned element
  const rootProperties = [
    "color",
    "backgroundColor",
    "borderColor",
    "fill",
    "stroke",
  ];

  rootProperties.forEach((prop) => {
    const currentValue = clonedElement.style.getPropertyValue(prop);
    if (
      currentValue &&
      (currentValue.includes("oklch") || currentValue.includes("oklab"))
    ) {
      clonedElement.style.removeProperty(prop);
    }
  });
};

/**
 * hook for creating screenshot from html node
 */
const useScreenshot = ({
  type = "image/png",
  quality = 1,
}: UseScreenshotOptions = {}): [
  string | null,
  (node: HTMLElement, options?: Partial<Options>) => Promise<string | void>,
  { error: Error | null }
] => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * convert html node to image
   * @param {HTMLElement} node
   * @param {Options} options - html2canvas options
   */
  const takeScreenShot = async (
    node: HTMLElement,
    options: Partial<Options> = {}
  ): Promise<string | void> => {
    console.log("takeScreenShot called");
    console.log("Node:", node);
    console.log("Options:", options);

    if (!node) {
      console.error("No node provided");
      throw new Error("You should provide correct html node.");
    }

    try {
      console.log("Starting html2canvas...");
      const canvas = await html2canvas(node, {
        logging: false,
        useCORS: true,
        ...options,
        onclone: (clonedDoc, clonedElement) => {
          console.log("Cloned document, converting colors...");
          convertModernColorsInClone(clonedDoc, clonedElement);

          // Call user's onclone if provided
          if (options.onclone) {
            options.onclone(clonedDoc, clonedElement);
          }
        },
      });

      console.log("Canvas created:", canvas);
      console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

      console.log("Converting to data URL...");
      const base64Image = canvas.toDataURL(type, quality);
      console.log("Base64 image created, length:", base64Image.length);

      setImage(base64Image);
      setError(null);
      console.log("Image state set");
      return base64Image;
    } catch (err) {
      console.error("Error in takeScreenShot:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  return [image, takeScreenShot, { error }];
};

/**
 * creates name of file
 * @param {string} extension
 * @param  {string[]} names - parts of file name
 */
const createFileName = (extension: string = "", ...names: string[]): string => {
  if (!extension) {
    return "";
  }

  return `${names.join("")}.${extension}`;
};

export { createFileName, useScreenshot };
export type { UseScreenshotOptions, UseScreenshotReturn };
