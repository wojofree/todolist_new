const updateSVG = (chartElement, gElement, width, padding) => {
    const gInfo = gElement.getBoundingClientRect();
    const pieInfo = chartElement.getBoundingClientRect();
    const svgElement = chartElement.querySelector("svg");
    const divElement = chartElement.querySelector("div");

    // g标签整体放大，宽度撑满
    const scaleFactor = width / gInfo.width;
    const transformValue = gElement.getAttribute("transform") || "";
    gElement.setAttribute(
        "transform",
        `${transformValue} scale(${scaleFactor})`
    );

    // 文字大小还原
    const textElements = gElement.querySelectorAll("text");
    textElements.forEach((textElement) => {
        const inverseScaleFactor = 1 / scaleFactor;
        const textTransformValue = textElement.getAttribute("transform") || "";
        textElement.setAttribute(
            "transform",
            `${textTransformValue} scale(${inverseScaleFactor})`
        );
    });

    // 宽高适配放大后g标签
    // 宽高适配放大后g标签
    const gInfoNew = chartElement.querySelector("svg g").getBoundingClientRect();

    divElement.style.height = gInfoNew.height - pieInfo.y + gInfoNew.y + 'px';
    divElement.style.width = width * scaleFactor + 50 + 'px';
    svgElement.style.height = gInfoNew.height - pieInfo.y + gInfoNew.y + 'px';
    svgElement.style.width = width * scaleFactor + 50 + 'px';

    // 移动位置及外层高度限制；
    chartElement.style.height = gInfoNew.height + 'px';
    divElement.style.marginLeft = (pieInfo.x - gInfoNew.x + padding) + 'px';
    divElement.style.marginTop = (pieInfo.y - gInfoNew.y) + 'px';
};

export const getGElement = (chartElement, padding = 0) => {
    const gElement = chartElement.querySelector("svg g");
    const width = chartElement.getBoundingClientRect().width

    if (!gElement) {
        setTimeout(() => {
            getGElement();
        }, 500);
    } else {
        updateSVG(chartElement, gElement, width, padding);
    }
};

const optionsCheck = (
    value,
    defaultValue,
    checkKey = "heading"
) => {
    switch (checkKey) {
        case "heading":
        case "text":
            if (value === "" || value === "null") {
                return defaultValue;
            }
            break;
        case "isPercentage":
        case "isShowLabel":
            if (typeof value !== "boolean") {
                return defaultValue;
            }
            break;
        default:
            if (
                value === "" ||
                value === null ||
                value === "null" ||
                value === undefined ||
                isNaN(parseFloat(value)) ||
                !isFinite(value)
            ) {
                return defaultValue;
            }
    }

    return value;
};


export const handleOption = (defaultOptions, newOptions) => {
    return Object.entries(defaultOptions).reduce(
        (options, [key, defaultValue]) => {
            options[key] = optionsCheck(newOptions[key], defaultValue, key);
            return options;
        },
        {
            ...defaultOptions,
            ...newOptions,
            data: newOptions.data || defaultOptions.data,
        });
}




