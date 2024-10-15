import { Handle, Position } from '@xyflow/react';
import React, { useCallback, useState } from 'react';

const CustomNode = ({ id, data, width, height }) => {
    data.backgroundColor = id == 1 ? '#e3783263' : '#ffffff33'

    const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor)

    const handleTitleChange = useCallback((evt) => {
        data.title = evt.target.value
    }, []);

    const handleDescriptionChange = useCallback((evt) => {
        data.description = evt.target.value
    }, []);

    const handleBackgroundColorChange = useCallback((evt) => {
        data.backgroundColor = evt.target.value + '63'
        setBackgroundColor(data.backgroundColor)
    }, []);

    return (
        <div
            className='nowheel'
            style={{
                backgroundColor: backgroundColor,
                // backgroundColor: '#a87efe',
                padding: 8,
                minWidth: 400,
                minHeight: 200,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            <Handle id="source-top" style={{ padding: 2 }} type="source" position={Position.Top} />
            <Handle id="source-right" style={{ padding: 2 }} type="source" position={Position.Right} />
            <Handle id="source-bottom" style={{ padding: 2 }} type="source" position={Position.Bottom} />
            <Handle id="source-left" style={{ padding: 2 }} type="source" position={Position.Left} />


            <Handle id="target-top" style={{ padding: 2 }} type="target" position={Position.Top} />
            <Handle id="target-right" style={{ padding: 2 }} type="target" position={Position.Right} />
            <Handle id="target-bottom" style={{ padding: 2 }} type="target" position={Position.Bottom} />
            <Handle id="target-left" style={{ padding: 2 }} type="target" position={Position.Left} />

            <div style={{ textAlign: 'center', display: 'flex', gap: 4 }}>
                <input
                    type="text"
                    defaultValue={data.title}
                    onChange={handleTitleChange}
                    style={{
                        width: '100%',
                        fontSize: 'larger',
                        color: 'white',
                        backgroundColor: 'transparent',
                        outline: 'none',
                        border: 'none',
                    }}
                />
                <input type="color" onChange={handleBackgroundColorChange} value={backgroundColor.slice(0, -2)} hidden />
            </div>
            <hr style={{ width: '100%' }} />
            <textarea
                defaultValue={data.description}
                placeholder='Description'
                onChange={handleDescriptionChange}
                style={{
                    flex: '1',
                    fontSize: 'larger',
                    color: 'whitesmoke',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                }}
            />
        </div>
    );
};

export default CustomNode;
