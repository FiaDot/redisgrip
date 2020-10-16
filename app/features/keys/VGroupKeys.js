import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectKey } from '../servers/selectedSlice';
import {FixedSizeTree as Tree} from 'react-vtree';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Label from '@material-ui/icons/Label';
import AutoSizer from 'react-virtualized-auto-sizer';
import IconButton from '@material-ui/core/IconButton';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import Tooltip from '@material-ui/core/Tooltip';

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[600]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};


const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function VGroupKeys() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const keys = useSelector((state) => state.keys);

  const onSelectKey = async (key) => {
    console.log(`VGroupKeys onSelectKey key=${key}`);
    await dispatch(selectKey({ key }));
  };

  const onSelectGroupKey = async (groupKey) => {
    console.log(`VGroupKeys:onSelectGroupKey() ${groupKey}`);
  };

  const sample = [
    { key: 'a123', count: 1, deleted: false },
    { key: 'bfds', count: 1, deleted: false },
    { key: 'c_1', count: 1, deleted: false },
    { key: 'c_2', count: 1, deleted: false },
    { key: 'd_1', count: 1, deleted: false },
    { key: 'd_2', count: 1, deleted: false },
  ];

  const getGroups = (param) => {
    const tmp = param.reduce((acc, item) => {
      const prefix = item.key.split('_')[0];
      // console.log(`prefix=${JSON.stringify(prefix)}`);

      if (!acc[prefix]) {
        acc[prefix] = [];
      }
      acc[prefix].push(item);
      return acc;
    }, {});

    return tmp;
  };


  const generate = (groups) => {
    let newTree = {
      name: 'root',
      id: 'root',
      children: [],
    };

    Object.entries(groups).map(([key, value], index) => {
      let subKey = { id: key, name: key, children: [] };
      newTree.children.push(subKey);

      if (value.length > 1) {
        value.map((record) => {
          const node = { id: record.key, name: record.key, children: [] };
          subKey.children.push(node);
        });
      }
    });

    return newTree;
  };

  const newGroups = useMemo(() => getGroups(keys), [keys]);

  // Tree component can work with any possible tree structure because it uses an
// iterator function that the user provides. Structure, approach, and iterator
// function below is just one of many possible variants.
//   const tree = {
//     name: 'Root #1',
//     id: 'root-1',
//     children: [
//       {
//         children: [
//           {id: 'child-2', name: 'Child #2'},
//           {id: 'child-3', name: 'Child #3'},
//         ],
//         id: 'child-1',
//         name: 'Child #1',
//       },
//       {
//         children: [{id: 'child-5', name: 'Child #5'}],
//         id: 'child-4',
//         name: 'Child #4',
//       },
//     ],
//   };

  function* treeWalker(refresh) {
    const stack = [];

    const data = generate(getGroups(sample));
    console.log(data);
    // Remember all the necessary data of the first node in the stack.
    stack.push({
      nestingLevel: 0,
      node: data,
    });

    // Walk through the tree until we have no nodes available.
    while (stack.length !== 0) {
      const {
        node: {children = [], id, name},
        nestingLevel,
      } = stack.pop();

      // Here we are sending the information about the node to the Tree component
      // and receive an information about the openness state from it. The
      // `refresh` parameter tells us if the full update of the tree is requested;
      // basing on it we decide to return the full node data or only the node
      // id to update the nodes order.
      const isOpened = yield refresh
        ? {
          id,
          isLeaf: children.length === 0,
          isOpenByDefault: true,
          name,
          nestingLevel,
        }
        : id;

      // Basing on the node openness state we are deciding if we need to render
      // the child nodes (if they exist).
      if (children.length !== 0 && isOpened) {
        // Since it is a stack structure, we need to put nodes we want to render
        // first to the end of the stack.
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push({
            nestingLevel: nestingLevel + 1,
            node: children[i],
          });
        }
      }
    }
  }

// Node component receives all the data we created in the `treeWalker` +
// internal openness state (`isOpen`), function to change internal openness
// state (`toggle`) and `style` parameter that should be added to the root div.
  const Node = ({data: {isLeaf, name, id, nestingLevel}, isOpen, style, toggle}) => (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        margin: 0,
        marginLeft: nestingLevel * 5 + (isLeaf ? 20 : 0),
      }}
    >

    { nestingLevel != 0 && !isLeaf && (
      isOpen ?
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={toggle}
        >
          <ArrowRightIcon
            className={classes.buttonIcon}
            color={'primary'}
            // style={{ fontSize: 24 }}
            fontSize="large"
          />
        </IconButton>
        :
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={toggle}
        >
          <ArrowDropDownIcon
            className={classes.buttonIcon}
            color={'primary'}
            // style={{ fontSize: 24 }}
            fontSize="large"
          />
        </IconButton>

    )}

    { nestingLevel == 0 ?
      ''
      :
        isLeaf ?
          <StyledTreeItem
            key={name}
            nodeId={name}
            labelText={name}
            labelIcon={VpnKeyOutlinedIcon}
            onClick={(event) => onSelectKey(name)}
          />
          :
          <div>{name}</div>
    }

    </div>
  );


  return (
    <div style = {{height:'70vh'}}>
      <AutoSizer>
        {({ height, width }) => (
          <Tree treeWalker={treeWalker} itemSize={50} height={height} width={width}>
            {Node}
          </Tree>
        )}
      </AutoSizer>
    </div>
  );
}

