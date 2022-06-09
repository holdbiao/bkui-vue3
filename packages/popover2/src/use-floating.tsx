/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
import { computed, ref, watch } from 'vue';

import { bkZIndexManager } from '@bkui-vue/shared';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  flip,
  hide,
  inline,
  offset,
  Placement,
  shift } from '@floating-ui/dom';

import { PopoverPropTypes } from './props';


export default (props: PopoverPropTypes, ctx, refReference, refContent, refArrow) => {
  const localIsShow = ref(false);
  const themeList = ['dark', 'light'];
  const compTheme = computed(() => {
    const themes = props.theme.split(/\s+/);
    themes.sort((a: string, b: string) => Number(themeList.includes(b)) - (Number(themeList.includes(a))));
    const systemThemes = themes;
    const customThemes = themes.filter((item: string) => !themeList.includes(item));
    return { systemThemes, customThemes };
  });


  const resolvePopElements = () => {
    const elReference = resolveTargetElement(refReference.value?.$el);
    const elContent = resolveTargetElement(refContent.value?.$el);
    const elArrow = props.arrow ? resolveTargetElement(refArrow.value?.$el) : null;

    return { elReference, elContent, elArrow };
  };

  const resolvePopOptions = (elArrow: any) => {
    const middleware = [
      offset(props.offset),
      shift({ padding: props.padding }),
      arrow({ element: elArrow }),
    ];
    const options = {
      placement: props.placement as Placement,
      middleware,
    };

    if (props.autoPlacement) {
      middleware.push(autoPlacement());
    } else {
      middleware.unshift(inline());
      middleware.push(flip());
    }

    if (props.autoVisibility) {
      options.middleware.push(hide());
    }
    return options;
  };

  const resolveTargetElement = (target: any) => {
    if (target instanceof HTMLElement) {
      return target;
    }

    if (target instanceof Text) {
      return resolveTargetElement(target.nextElementSibling);
    }

    return null;
  };

  // 兼容多种样式处理规则
  // class custom-theme
  const customThemeCls = compTheme.value.customThemes.join(' ');
  const customTheme = compTheme.value.customThemes.reduce((out, cur) => ({ [`data-${cur}-theme`]: true, ...out }), {});
  const contentClass = `${customThemeCls}`;

  let cleanup = null;

  const getRoundPixelVal = (val: number) => {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(val * dpr) / dpr || 0;
  };

  const isElementFullScreen = () => document.fullscreenElement !== null;

  const updatePopContentStyle = (elContent, x, y, resolvedPlacement, middlewareData, elReference) => {
    const { left, top } = elReference.getBoundingClientRect();
    const resolveFullscreenOffsetX = (xValue: number) => {
      if (['left', 'right'].includes(resolvedPlacement)) {
        return getRoundPixelVal(xValue);
      }

      return left;
    };

    const resolveFullscreenOffsetY = (yValue: number) => {
      if (['top', 'bottom'].includes(resolvedPlacement)) {
        return getRoundPixelVal(yValue);
      }

      return top;
    };

    const getOffsetX = () => {
      if (isElementFullScreen()) {
        return resolveFullscreenOffsetX(x);
      }

      return getRoundPixelVal(x);
    };

    const getOffsetY = () => {
      if (isElementFullScreen()) {
        return resolveFullscreenOffsetY(y);
      }

      return getRoundPixelVal(y);
    };

    Object.assign(elContent.style, {
      left: '0',
      top: '0',
      transform: `translate3d(${getOffsetX()}px,${getOffsetY()}px,0)`,
    });

    if (props.autoVisibility) {
      const { referenceHidden } = middlewareData.hide;
      Object.assign(elContent.style, {
        visibility: referenceHidden ? 'hidden' : 'visible',
      });
    }
  };

  const updateArrowStyle = (elArrow, resolvedPlacement, middlewareData, elReference) => {
    const { left, top, bottom, right } = elReference.getBoundingClientRect();
    if (props.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;
      const staticPrefix = {
        top: 1,
        right: -1,
        bottom: -1,
        left: 1,
      }[resolvedPlacement];

      const getStaticSidePos = (val, pos, defaultVal) => {
        const staticSide = {
          x: {
            left: 'right',
            right: 'left',
          },
          y: {
            top: 'bottom',
            bottom: 'top',
          },
        }[pos]?.[resolvedPlacement] ?? defaultVal;

        return [val, staticSide];
      };


      const getFullScreenOffset = (arrowValue: any) => {
        if (isElementFullScreen()) {
          if (['left', 'right'].includes(resolvedPlacement)) {
            return getRoundPixelVal((bottom - top) / 2) - 2;
          }

          if (['top', 'bottom'].includes(resolvedPlacement)) {
            return getRoundPixelVal((right - left) / 2) - 2;
          }
        }

        return isNumber(arrowValue) ? getRoundPixelVal(arrowValue) : 0;
      };

      const getOffsetX = () => {
        if (['left', 'right'].includes(resolvedPlacement)) {
          return staticPrefix * 4;
        }

        return getFullScreenOffset(arrowX);
      };

      const getOffsetY = () => {
        if (['top', 'bottom'].includes(resolvedPlacement)) {
          return staticPrefix * 4;
        }

        return getFullScreenOffset(arrowY);
      };

      elArrow.setAttribute('data-arrow', resolvedPlacement);
      const [offsetX, xPos] = getStaticSidePos(getOffsetX(), 'x', 'left');
      const [offsetY, yPos] = getStaticSidePos(getOffsetY(), 'y', 'top');
      Object.assign(elArrow.style, {
        [xPos]: '0',
        [yPos]: '0',
        transform: `translate(${offsetX}px,${offsetY}px) rotate(45deg)`,
      });
    }
  };

  const updatePopover = () => {
    const { elReference, elContent, elArrow } = resolvePopElements();
    const options = resolvePopOptions(elArrow);
    cleanup = autoUpdate(elReference, elContent, () => {
      computePosition(elReference, elContent, options).then(({ x, y, placement, middlewareData }) => {
        const oldClass = elContent.className;
        elContent.className = `${oldClass.replace(contentClass, '')} ${contentClass}`.replace(/\s+/mg, ' ').replace(/^\s+|\s+$/g, '');
        Object.keys(customTheme).forEach((key: string) => {
          elContent.setAttribute(key, customTheme[key]);
        });

        const placementStr = placement.split('-')[0];
        let resolvedPlacement = placementStr;
        if (!['left', 'right', 'top', 'bottom'].includes(placementStr)) {
          resolvedPlacement = 'top';
        }

        updatePopContentStyle(elContent, x, y, resolvedPlacement, middlewareData, elReference);
        updateArrowStyle(elArrow, resolvedPlacement, middlewareData, elReference);
      });
    });
  };

  const isNumber = (val: string | number) => /^-?\d+\.?\d*$/.test(`${val}`);
  const showPopover = () => {
    localIsShow.value = true;
  };

  const hidePopover = () => {
    localIsShow.value = false;
  };

  const hanldePopoverShow = () => {
    const elContent = resolveTargetElement(refContent.value?.$el) as HTMLElement;
    elContent.style.setProperty('display', 'block');
    elContent.style.setProperty('z-index', `${props.zIndex ? props.zIndex : bkZIndexManager.getModalNextIndex()}`);
    updatePopover();
    ctx.emit('afterShow', { isSHow: true });
  };

  const handlePopoverHide = () => {
    const elContent = resolveTargetElement(refContent.value?.$el);
    elContent.style.setProperty('display', 'none');
    ctx.emit('afterHidden', { isSHow: false });
  };

  const triggerPopover = () => {
    if (!localIsShow.value) {
      showPopover();
    } else {
      hidePopover();
    }
  };

  const hanldeClickRef = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    triggerPopover();
  };

  const resolveTriggerEvents = () => {
    const triggerEvents = {
      hover: [['mouseenter', showPopover],
        ['mouseleave', hidePopover],
        ['focus', showPopover],
        ['blur', hidePopover]],
      click: [['click', hanldeClickRef]],
      manual: [[]],
    };

    return triggerEvents[props.trigger] ?? [];
  };

  watch(localIsShow, (val) => {
    if (val) {
      hanldePopoverShow();
    } else {
      handlePopoverHide();
    }
  });

  return {
    showPopover,
    hidePopover,
    resolveTriggerEvents,
    updatePopover,
    triggerPopover,
    resolvePopElements,
    isElementFullScreen,
    localIsShow,
    cleanup,
  };
};