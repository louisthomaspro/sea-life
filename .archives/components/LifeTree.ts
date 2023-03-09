import React, { useState, useEffect, forwardRef, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column, ColumnBodyOptions } from "primereact/column";
import {
  deleteLife,
  getCategories,
  getChildren,
} from "../../utils/firestore/life.firestore";
import { ILife } from "../../types/Life";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import { Menu } from "primereact/menu";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import styled from "styled-components";

const LifeUpdateFormDynamic = dynamic(
  () => import("../../components/admin/LifeUpdateForm")
);

interface LifeNode {
  key: string;
  data: {
    name: string;
    children: number;
    life: ILife;
  };
  leaf: boolean;
  children?: LifeNode[];
}

const LifeTree = forwardRef((props, ref) => {
  const [displayFormUpdate, setDisplayFormUpdate] = useState(false);
  const [nodes, setNodes] = useState([] as LifeNode[]);
  const [loading, setLoading] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [updateLifeId, setUpdateLifeId] = useState(null);

  const [activeNode, setActiveNode] = useState(null as LifeNode);
  const menu = useRef(null);

  useEffect(() => {
    getCategories().then((rows) => {
      setExpandedKeys([]);
      setNodes(loadNodes(rows));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    console.log(expandedKeys);
  }, [expandedKeys]);

  const items = [
    {
      label: "Update",
      icon: "pi pi-pencil",
      command: () => {
        handleUpdateLife(activeNode.key);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-times",
      command: () => {
        handleDeleteLife(activeNode.key);
      },
    },
  ];

  const handleDeleteLife = async (lifeId: string) => {
    confirmDialog({
      header: "Confirmation",
      message: "Êtes vous sûr de vouloir supprimer cet element?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await deleteLife(lifeId);
        getCategories().then((rows) => {
          setExpandedKeys([]);
          setNodes(loadNodes(rows));
          setLoading(false);
        });
      },
      reject: () => {},
    });
  };

  const handleUpdateLife = async (lifeId: string) => {
    setUpdateLifeId(lifeId);
    setDisplayFormUpdate(true);
  };

  // useImperativeHandle(ref, () => ({
  //   reload() {
  //     setLoading(true);
  //     setTimeout(() => {
  //       initLifeTree();
  //     }, 1000);
  //   },
  // }));

  const loadNodes = (rows: ILife[]) => {
    let nodes = [];

    for (let i = 0; i < rows.length; i++) {
      let node: LifeNode = {
        key: rows[i].id,
        data: {
          name: rows[i].french_common_name,
          children: rows[i].child_ids?.length ?? 0,
          life: rows[i],
        },
        leaf: rows[i].type === "species",
      };

      nodes.push(node);
    }

    return nodes;
  };

  const updateNodeInTree = (
    nodes: LifeNode[],
    nodeId: string,
    newNode: LifeNode
  ) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === nodeId) {
        nodes[i] = newNode;
      } else if (nodes[i].children) {
        updateNodeInTree(nodes[i].children, nodeId, newNode);
      }
    }
  };

  const actionTemplate = (node: LifeNode, column: ColumnBodyOptions) => {
    if (node.data.life.parent_id) {
      return (
        <div className="flex">
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-rounded p-button-text p-button-plain"
            aria-label="Menu"
            onClick={(event) => {
              setActiveNode(node);
              menu.current.toggle(event);
            }}
            aria-controls="popup_menu"
            aria-haspopup
          />
        </div>
      );
    } else {
      return;
    }
  };

  const onExpand = (event: any) => {
    setLoading(true);
    getChildren(event.node.data.life.id).then((rows) => {
      setLoading(false);
      let lazyNode: LifeNode = { ...event.node };

      lazyNode.children = [];

      for (let i = 0; i < rows.length; i++) {
        let node = {
          key: rows[i].id,
          data: {
            name: rows[i].scientific_name,
            children: rows[i].child_ids.length,
            life: rows[i],
          },
          leaf: rows[i].child_ids.length === 0,
        };

        lazyNode.children.push(node);
      }

      updateNodeInTree(nodes, event.node.key, lazyNode);

      setLoading(false);
      setNodes(nodes);
    });
  };

  return (
    <Style>
      <TreeTable
        value={nodes}
        lazy
        onExpand={onExpand}
        loading={loading}
        expandedKeys={expandedKeys as any}
        onToggle={(e) => setExpandedKeys(e.value as any)}
      >
        <Column field="name" header="Nom" className="column" expander></Column>
        <Column field="children" className="child-column column"></Column>
        <Column body={actionTemplate} className="action-column column"></Column>
      </TreeTable>

      <Menu model={items} popup ref={menu} id="popup_menu" />
      <ConfirmDialog />

      <Dialog
        className="dialogModal"
        header={`Modifier "${activeNode?.data.name}"`}
        visible={displayFormUpdate}
        onHide={() => setDisplayFormUpdate(false)}
        style={{ width: "75vw" }}
        maximized={true}
      >
        <LifeUpdateFormDynamic
          id={updateLifeId}
          onSubmit={() => {
            setUpdateLifeId(null);
            setDisplayFormUpdate(false);
          }}
        />
      </Dialog>
    </Style>
  );
});

// Style
const Style = styled.div`
  .column {
    padding: 0.5rem 0.5rem !important;
    vertical-align: middle;
  }
  .action-column {
    width: 60px !important;
  }
  .child-column {
    width: 60px !important;
  }
`;

LifeTree.displayName = "LifeTree";
export default LifeTree;
