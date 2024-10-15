import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode'

const initialNodes = []
const initialEdges = []

export default function App() {
    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [menuPosition, setMenuPosition] = useState(null);

    useEffect(() => {
        const handleClick = () => {
            closeMenu();
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const onConnect = useCallback(
        (params) => {
            if (params.target == params.source) {
                return
            }
            const newEdge = {
                source: params.source,
                sourceHandle: params.sourceHandle,
                targetHandle: params.targetHandle,
                target: params.target,
                animated: true,
                markerStart: { type: 'arrowclosed' },
                style: { strokeWidth: 3, stroke: '#ffffff99' },
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    )


    const handleRightClick = (event) => {
        event.preventDefault();
        setMenuPosition({ x: event.clientX, y: event.clientY });
    };

    const addNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            position: { x: menuPosition.x ? menuPosition.x - 200 : Math.random() * 800, y: menuPosition.y || Math.random() * 600 }, // Random position
            data: {
                title: `Node ${nodes.length + 1}`,
                description: ''
            },
            type: 'customNode',
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const closeMenu = () => {
        setMenuPosition(null);
    };

    return (
        <div
            style={{ width: '100vw', height: '100vh' }}
            onContextMenu={handleRightClick}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                colorMode='dark'
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>

            {menuPosition && (
                <ContextMenu
                    x={menuPosition.x}
                    y={menuPosition.y}
                    onClose={closeMenu}
                    onAddNode={addNode}
                    onExportToJSON={() => {
                        const graph = {}

                        graph.nodes = nodes.map(node => ({
                            id: node.id,
                            title: node.data.title,
                            description: node.data.description,
                        }))

                        graph.edges = edges.map(edge => ({
                            source: edge.source,
                            target: edge.target,
                        }))


                        const json = JSON.stringify(graph, null, 4)
                        const blob = new Blob([json], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')

                        a.href = url;
                        a.download = 'mindmap.json'
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                    }}
                    onDownloadFile={() => {
                        const graph = {}

                        graph.nodes = nodes
                        graph.edges = edges


                        const json = JSON.stringify(graph, null, 4)
                        const blob = new Blob([json], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')

                        a.href = url;
                        a.download = 'mindmap.mm'
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                    }}
                    onNewFile={() => {
                        if (window.confirm('Are you sure you want to create a new file?')) {
                            setNodes([])
                            setEdges([])
                        }
                    }}
                />
            )}
            <input
                type="file"
                accept=".mm"
                style={{ display: 'none' }}
                id="file-upload"
                onChange={async (e) => {
                    try {
                        if (e.target.files.length == 0) {
                            alert('Please select file')
                            return
                        }
                        const file = e.target.files[0]

                        const reader = new FileReader()

                        reader.onload = function (e1) {
                            const result = e1.target.result
                            try {
                                const { nodes, edges } = JSON.parse(result)
                                setNodes(nodes || [])
                                setEdges(edges || [])
                                e.target.value = '';
                            } catch (error) {
                                alert('Invalid file format. Please upload a valid file.')
                                e.target.value = '';
                            }
                        }
                        reader.readAsText(file);
                    } catch (error) {
                        e.target.value = '';
                        alert('Invalid file format. Please upload a valid file.')
                    }
                }}
            />
            <label htmlFor="file-upload" style={{ position: 'absolute', top: 10, left: 10, cursor: 'pointer', background: '#ffffff50', color: 'white', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
                Import Mindmap
            </label>
        </div>
    );
}


const ContextMenu = ({ x, y, onClose, onAddNode, onExportToJSON, onDownloadFile, onNewFile }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: y,
                left: x,
                background: '#ffffff50',
                color: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
            }}
        >
            <div onClick={() => { onAddNode(); onClose(); }} style={{ padding: '8px', cursor: 'pointer' }}>
                Add Node
            </div>

            <div onClick={() => { onExportToJSON(); onClose(); }} style={{ padding: '8px', cursor: 'pointer' }}>
                Export to JSON
            </div>
            <div onClick={() => { onDownloadFile(); onClose(); }} style={{ padding: '8px', cursor: 'pointer' }}>
                Download File
            </div>
            <div onClick={() => { onNewFile(); onClose(); }} style={{ padding: '8px', cursor: 'pointer' }}>
                New File
            </div>
        </div>
    );
};
