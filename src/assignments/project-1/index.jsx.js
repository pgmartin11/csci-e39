import React from 'react'
import PropTypes from 'prop-types'
import Uploader from '../../ui/components/uploader.jsx'

const FileList = ({title, files, eventHandler}) => {
	return (
		<div>
			<h2>{title}</h2>
			<ul>
				{files.map(file => {
					if (title.toLowerCase() == 'completed') {
						return (<FileItem key={file.id} file={file} eventHandler={eventHandler}/>)
					} else {
						return (<UploadItem key={file.id} file={file}/>)
					}			
				})}
			</ul>
		</div>
	)
}

const UploadItem = ({file}) => {
	const {name, progress} = file;

	return (
		<li>
			<label>{name}</label>
			<progress value={progress} max="100">{progress}%</progress>
		</li>
	)
}

const FileItem = ({file, eventHandler}) => {
	const {id, name, url, error} = file;

	const handleClick = () => {
		eventHandler(file);
	}

	return (
		<li>
			<figure>
				{!error && <img src={url} alt={name} style={{maxWidth: `100%`}} />}
				{!error && <figcaption>{name}</figcaption>}
				{!!error && <p className="failure">{error}</p>}
				{!error && <button onClick={handleClick}>Enlarge</button>}
			</figure>
		</li>
	)
}

const LargeFile = ({file, removeHandler}) => {
	const {name, url, error} = file;

	const handleClick = () => {
		removeHandler();
	}

	return (
		<figure>
			{!error && <img src={url} alt={name} style={{maxWidth: `100%`}} />}
			{!error && <figcaption>{name}</figcaption>}
			{!error && <button onClick={handleClick}>Clear</button>}
		</figure>
	)
}

class Uploads extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selFile: null
		}
		this.selectFile = this.selectFile.bind(this);
		this.removeFile = this.removeFile.bind(this);
	}

	selectFile(file) {
		this.setState({
			selFile: file
		})
	}

	removeFile() {
		this.setState({
			selFile: null
		})
	}

	render() {
		const {uploads, actions} = this.props;
		const pendingFiles = uploads.files.filter(({progress}) => progress && progress < 100)
		const completedFiles = uploads.files.filter(({progress}) => !progress)

		return (
			<div className="wrapper">
				<header className="box">
					<h1>Upload Images</h1>
				</header>
				<main className="box">
					{/* do not delete this uploader component */}
					<Uploader upload={actions.upload} />
					{/* do not delete this uploader component */}
					<FileList title="In Progress" files={pendingFiles} eventHandler={this.selectFile}/>
					{this.state.selFile && <LargeFile file={this.state.selFile} removeHandler={this.removeFile}/>}
				</main>
				<aside className="box">
					<FileList title="Completed" files={completedFiles} eventHandler={this.selectFile}/>
				</aside>
			</div>)
	}
}

const statusPropType = PropTypes.shape({
	status: PropTypes.oneOf([`init`, `pending`, `success`, `failure`]).isRequired,
	message: PropTypes.string.isRequired,
})

Uploads.propTypes = {
	uploads: PropTypes.shape({
		files: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
			name: PropTypes.string.isRequired,
			progress: PropTypes.number,
			url: PropTypes.string,
			error: PropTypes.string,
		})).isRequired,
		update: statusPropType.isRequired,
		delete: statusPropType.isRequired,
		share: statusPropType.isRequired,
	}).isRequired,
	actions: PropTypes.object.isRequired,
}

export default Uploads
