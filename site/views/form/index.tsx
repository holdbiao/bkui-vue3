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

import {
  defineComponent,
} from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import {
  type IPropsTableItem,
} from '../../typings';

import DemoForm from './demo/form.vue';
import DemoFormValidator from './demo/form-validator.vue';
import DemoFormVertical from './demo/form-vertical.vue';;


const formProps: IPropsTableItem[] = [
  {
    name: 'formType',
    type: 'String',
    default: null,
    desc: '表单模式',
    optional: ['default', 'vertical'],
  },
  {
    name: 'labelWidth',
    type: 'String',
    default: null,
    desc: '表单域标签的宽度',
    optional: [],
  },
  {
    name: 'labelPosition',
    type: 'String',
    default: null,
    desc: '表单域标签的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'model',
    type: 'Object',
    default: null,
    desc: '表单数据',
    optional: [],
  },
  {
    name: 'rules',
    type: 'Array',
    default: null,
    desc: '表单验证规则',
    optional: [],
  },
];

const formItemProps: IPropsTableItem[] = [
  {
    name: 'label',
    type: 'String',
    default: null,
    desc: '标签',
    optional: [],
  },
  {
    name: 'labelWidth',
    type: 'String',
    default: null,
    desc: '表单域标签的宽度',
    optional: [],
  },
  {
    name: 'labelPosition',
    type: 'String',
    default: null,
    desc: '表单域标签的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'property',
    type: 'String',
    default: null,
    desc: '表单域 model 字段',
    optional: [],
  },
  {
    name: 'required',
    type: 'Boolean',
    default: null,
    desc: '是否必填',
    optional: [],
  },
  {
    name: 'max',
    type: 'Number',
    default: null,
    desc: '验证规则最大值',
    optional: [],
  },
  {
    name: 'min',
    type: 'Number',
    default: null,
    desc: '验证规则最小值',
    optional: [],
  },
  {
    name: 'email',
    type: 'String',
    default: null,
    desc: '验证规则Email',
    optional: [],
  },
  {
    name: 'rules',
    type: 'Array',
    default: null,
    desc: '验证规则',
    optional: [],
  },
  {
    name: 'autoCheck',
    type: 'String',
    default: null,
    desc: '是否自动验证',
    optional: [],
  },
  {
    name: 'description',
    type: 'String',
    default: null,
    desc: '是否自动验证',
    optional: [],
  },
];

export default defineComponent({
  name: 'Form',
  render() {
    return (
    <div>
      <DemoTitle
          name="Radio"
          desc="表单-单选框，在一组选项中进行单选"
          link="https://www.qq.com/"/>
        <DemoBox
          title="基础用法"
          desc=""
          componentName="form"
          demoName="/demo/form">
            <DemoForm />
        </DemoBox>
        <DemoBox
          title="顶部对齐"
          desc=""
          componentName="form"
          demoName="/demo/form-vertical">
            <DemoFormVertical />
        </DemoBox>
        <DemoBox
          title="表单验证"
          desc=""
          componentName="form"
          demoName="/demo/form-validator">
            <DemoFormValidator />
        </DemoBox>
        <PropsBox
          title="Form Attributes"
          subtitle=""
          propsData={formProps}/>
        <PropsBox
          title="Form-Item Attributes"
          subtitle=""
          propsData={formItemProps}/>
    </div>
    );
  },
});
